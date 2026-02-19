import { ref, nextTick, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import markdownItTaskLists from 'markdown-it-task-lists'
import markdownItIns from 'markdown-it-ins'
import markdownItMark from 'markdown-it-mark'
import markdownItSub from 'markdown-it-sub'
import markdownItSup from 'markdown-it-sup'
import mermaid from 'mermaid'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { inlineStyles } from '../utils/inlineStyles'
import { imageUnwrapPlugin, forceTightListPlugin } from '../utils/markdown-it-plugins'
import { fontFamilies } from './useEditorState'

// 内联 SVG 元素样式（必须在 DOM 中才能获取计算样式）
function inlineSvgElementStyles(svgEl) {
  // SVG 样式属性列表
  const svgProperties = [
    'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin',
    'font-family', 'font-size', 'font-weight', 'font-style', 'text-anchor',
    'dominant-baseline', 'alignment-baseline', 'opacity', 'fill-opacity', 'stroke-opacity',
    'marker-start', 'marker-mid', 'marker-end', 'marker'
  ]
  
  // 遍历 SVG 中的所有元素
  const allElements = svgEl.querySelectorAll('*')
  allElements.forEach(el => {
    if (!(el instanceof SVGElement)) return
    const computed = window.getComputedStyle(el)
    svgProperties.forEach(prop => {
      const val = computed.getPropertyValue(prop)
      // 只内联有实际值的属性
      if (val && val !== 'none' && val !== 'auto' && val !== 'inherit' && val !== '') {
        el.style.setProperty(prop, val)
      }
    })
  })
}

export function useMarkdownRenderer() {
  const outputHtml = ref('')
  const previewContainer = ref(null)

  const md = new MarkdownIt({ html: true, linkify: true, typographer: true })

  md.use(markdownItTaskLists)
  md.use(imageUnwrapPlugin)
  md.use(forceTightListPlugin)
  md.use(markdownItIns)
  md.use(markdownItMark)
  md.use(markdownItSub)
  md.use(markdownItSup)

  // 自定义列表渲染，手动添加列表符号（微信公众号不支持 list-style）
  md.renderer.rules.bullet_list_open = () => {
    return '<ul style="margin:0; padding:0 0 0 21px; list-style:none;">'
  }

  md.renderer.rules.bullet_list_close = () => {
    return '</ul>'
  }

  md.renderer.rules.ordered_list_open = (tokens, idx, options, env) => {
    const start = tokens[idx].attrGet('start') || 1
    if (!env._orderedCounters) env._orderedCounters = []
    env._orderedCounters.push(start)
    return '<ol style="margin:0; padding:0 0 0 21px; list-style:none;">'
  }

  md.renderer.rules.ordered_list_close = (tokens, idx, options, env) => {
    if (env._orderedCounters) env._orderedCounters.pop()
    return '</ol>'
  }

  md.renderer.rules.list_item_open = (tokens, idx, options, env) => {
    // 检查是否在有序列表中
    const isOrdered = env._orderedCounters && env._orderedCounters.length > 0
    if (isOrdered) {
      const num = env._orderedCounters[env._orderedCounters.length - 1]++
      return `<li style="margin:7px 8px; display:block;">${num}. `
    }
    return '<li style="margin:7px 8px; display:block;">• '
  }

  md.renderer.rules.list_item_close = () => {
    return '</li>'
  }

  const defaultFence = md.renderer.rules.fence
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const info = token.info.trim()
    if (info === 'mermaid') {
      const id = `mermaid-${Date.now()}-${idx}`
      // 使用 section 标签，避免被当作段落处理
      return `<section class="mermaid" id="${id}" style="text-align: center; margin: 1em auto;">${token.content}</section>`
    }
    return defaultFence ? defaultFence(tokens, idx, options, env, self) : ''
  }

  const render = async (opts) => {
    const { input, codeBlockStyle, imageCaptionMode, currentFont, wechatStyle } = opts

    md.set({
      highlight: function (str, lang) {
        let content = str
        if (lang && hljs.getLanguage(lang)) {
          try {
            content = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
          } catch (__) {
            content = md.utils.escapeHtml(str)
          }
        } else {
          content = md.utils.escapeHtml(str)
        }

        if (codeBlockStyle === 'macos') {
          const macHeader = `<div style="display: flex; gap: 6px; margin-bottom: 10px; align-items: center;"><span style="width: 12px; height: 12px; border-radius: 50%; background-color: #ff5f56; border: 1px solid #e0443e; display: inline-block;"></span><span style="width: 12px; height: 12px; border-radius: 50%; background-color: #ffbd2e; border: 1px solid #dea123; display: inline-block;"></span><span style="width: 12px; height: 12px; border-radius: 50%; background-color: #27c93f; border: 1px solid #1aab29; display: inline-block;"></span></div>`
          return `<pre class="hljs macos" style="background: #282c34; color: #abb2bf; padding: 15px; border-radius: 8px; overflow-x: auto;">${macHeader}<code style="font-family: Menlo, Monaco, Consolas, monospace; font-size: 13px; line-height: 1.5; background: transparent;">${content}</code></pre>`
        }

        return '<pre class="hljs"><code>' + content + '</code></pre>'
      }
    })

    md.renderer.rules.image = (tokens, idx, _options, _env, _self) => {
      const token = tokens[idx]
      const attrs = token.attrs || []
      let src = ''
      let title = ''
      for (const attr of attrs) {
        if (attr[0] === 'src') src = attr[1]
        if (attr[0] === 'title') title = attr[1]
      }
      const alt = token.content || (token.children && token.children.length ? token.children[0].content : '')
      const esc = md.utils.escapeHtml

      let captionText = ''
      switch (imageCaptionMode) {
        case 'title-priority': captionText = title || alt; break
        case 'alt-priority': captionText = alt || title; break
        case 'only-title': captionText = title || ''; break
        case 'only-alt': captionText = alt || ''; break
        default: captionText = ''; break
      }

      const imgBorder = 'border:1px solid rgba(0,0,0,0.04);'
      const imgStyle = captionText 
        ? `max-width:100%; height:auto; display:block; margin:0 auto; border-radius:8px; ${imgBorder}` 
        : `max-width:100%; height:auto; display:block; margin:0.5em auto; border-radius:8px; ${imgBorder}`
      const imgHtml = `<img src="${esc(src)}" alt="${esc(alt)}"${title ? ` title="${esc(title)}"` : ''} style="${imgStyle}" />`

      if (captionText) {
        // 使用 section 而不是 figure，微信公众号兼容性更好
        return `<section style="margin:1.5em 8px; text-align:center;">${imgHtml}<section style="font-size:0.8em; color:#888; text-align:center; margin-top:0.5em;">${esc(captionText)}</section></section>`
      }
      return `<section style="text-align:center; margin:0.5em 0;">${imgHtml}</section>`
    }

    let rawHtml = md.render(input)

    if (typeof document !== 'undefined') {
      const tmp = document.createElement('div')
      tmp.innerHTML = rawHtml
      const anchors = Array.from(tmp.querySelectorAll('a[href^="http"]'))
      const linkIndex = new Map()
      const links = []
      anchors.forEach(a => {
        const href = a.getAttribute('href') || ''
        if (!href || !/^https?:\/\//i.test(href)) return
        if (!linkIndex.has(href)) {
          linkIndex.set(href, linkIndex.size + 1)
          links.push(href)
        }
        const number = linkIndex.get(href)
        const span = document.createElement('span')
        span.innerHTML = a.innerHTML
        const sup = document.createElement('sup')
        sup.className = 'ref-mark'
        sup.textContent = `[${number}]`
        sup.setAttribute('style', 'font-size:12px; color:#888; vertical-align:super; margin-left:4px;')
        span.appendChild(sup)
        a.replaceWith(span)
      })

      if (links.length > 0) {
        const h2 = document.createElement('h2')
        h2.textContent = '引用链接'
        h2.setAttribute('style', 'font-size:14px; color:#666; margin-top:20px; border-top:1px solid #eee; padding-top:10px;')
        tmp.appendChild(h2)
        const ul = document.createElement('ul')
        ul.className = 'ref-links'
        ul.setAttribute('style', 'padding-left:0; margin:10px 0; list-style:none;')
        links.forEach((url, i) => {
          const li = document.createElement('li')
          li.setAttribute('style', 'font-size:13px; color:#666; margin:6px 0; word-break:break-all;')
          li.textContent = `[${i + 1}] ${url}`
          ul.appendChild(li)
        })
        tmp.appendChild(ul)
      }
      rawHtml = tmp.innerHTML
    }

    const combinedCss = wechatStyle + (codeBlockStyle === 'macos' ? `...` : `...`)

    const styledHtml = inlineStyles(rawHtml, combinedCss)
    // 用 section 包裹内容，符合微信公众号编辑器规范
    const baseHtml = `<section style="font-family: ${fontFamilies[currentFont] || 'sans-serif'}; font-size: 16px; line-height: 1.75; color: #3f3f3f;">${styledHtml}</section>`
    outputHtml.value = baseHtml

    await nextTick()
    
    // 处理 mermaid 渲染
    if (typeof document !== 'undefined') {
      const mermaidDivs = styledHtml.match(/class="mermaid"/g)
      if (mermaidDivs && mermaidDivs.length > 0) {
        try {
          mermaid.initialize({ 
            startOnLoad: false, 
            theme: 'default',
            fontSize: 14, 
            securityLevel: 'loose',
            flowchart: { curve: 'basis' },
            themeVariables: {
              primaryColor: '#E8F4FD',
              primaryTextColor: '#333',
              primaryBorderColor: '#4A90D9',
              lineColor: '#4A90D9',
              secondaryColor: '#F5F5F5',
              tertiaryColor: '#FFF'
            }
          })
        } catch (e) {
          console.warn('Mermaid re-initialization warning:', e)
        }

        // 创建一个隐藏的临时容器，插入到 DOM 中以便 getComputedStyle 能工作
        const tmpDiv = document.createElement('div')
        tmpDiv.style.position = 'absolute'
        tmpDiv.style.left = '-9999px'
        tmpDiv.style.top = '-9999px'
        tmpDiv.style.width = '800px'
        tmpDiv.style.visibility = 'hidden'
        tmpDiv.innerHTML = baseHtml
        document.body.appendChild(tmpDiv)
        
        try {
          const mermaidElements = tmpDiv.querySelectorAll('.mermaid')
          for (const div of mermaidElements) {
            const content = div.textContent || ''
            try {
              if (!content.trim()) continue
              const svgId = 'mermaid-svg-' + Date.now() + '-' + Math.random().toString(36).slice(2)
              const { svg } = await mermaid.render(svgId, content)
              div.innerHTML = svg
              const svgEl = div.querySelector('svg')
              if (svgEl) {
                // 设置 SVG 基础样式
                svgEl.style.maxWidth = '100%'
                svgEl.style.height = 'auto'
                svgEl.style.display = 'block'
                svgEl.style.margin = '0 auto'
                svgEl.style.backgroundColor = '#ffffff'
                
                // 内联 SVG 中所有元素的样式（关键：必须在 DOM 中才能获取计算样式）
                inlineSvgElementStyles(svgEl)
                
                // 设置字体
                const textElements = svgEl.querySelectorAll('text')
                textElements.forEach(textEl => {
                  textEl.style.fontFamily = fontFamilies[currentFont] || 'sans-serif'
                })
                
                // 处理 foreignObject 内的内容，简化 HTML 结构
                const foreignObjects = svgEl.querySelectorAll('foreignObject')
                foreignObjects.forEach(fo => {
                  // 获取所有文本内容
                  const textContent = fo.textContent || ''
                  // 查找内部的 p 和 span，简化结构
                  const innerP = fo.querySelector('p')
                  if (innerP) {
                    // 将 p 标签的内容直接设置为文本
                    innerP.innerHTML = textContent
                    innerP.style.margin = '0'
                    innerP.style.padding = '0'
                  }
                  // 移除所有 span 的 class
                  const spans = fo.querySelectorAll('span')
                  spans.forEach(span => {
                    span.removeAttribute('class')
                    span.style.fontSize = '14px'
                    span.style.fontFamily = fontFamilies[currentFont] || 'sans-serif'
                    // 如果 span 内还有 span，提取文本
                    if (span.querySelector('span')) {
                      const innerText = span.textContent || ''
                      span.innerHTML = innerText
                    }
                  })
                })
                
                // 移除 SVG 内的 style 标签（样式已内联）
                svgEl.querySelectorAll('style').forEach(s => s.remove())
                
                // 根据 viewBox 计算高度
                const vb = svgEl.getAttribute('viewBox')
                if (vb) {
                  const parts = vb.trim().split(/[\s,]+/)
                  if (parts.length === 4) {
                    const vbW = parseFloat(parts[2])
                    const vbH = parseFloat(parts[3])
                    if (vbW > 0 && vbH > 0) {
                      const renderW = Math.min(vbW, 677)
                      svgEl.setAttribute('height', `${Math.round(vbH * renderW / vbW)}px`)
                    }
                  }
                }
                
                // 创建新的 section 包裹 SVG
                const newSection = document.createElement('section')
                newSection.style.textAlign = 'center'
                newSection.style.margin = '1em auto'
                newSection.innerHTML = svgEl.outerHTML
                div.replaceWith(newSection)
              }
            } catch (e) {
              console.error('Mermaid render error:', e)
              const errorSection = document.createElement('section')
              errorSection.style.color = 'red'
              errorSection.style.fontSize = '12px'
              errorSection.textContent = `Mermaid Error: ${e}`
              div.replaceWith(errorSection)
            }
          }
          
          // 清理可能包裹 SVG 的 p 标签
          let html = tmpDiv.innerHTML
          // 移除包裹 section 的 p 标签
          html = html.replace(/<p([^>]*)>\s*<section([^>]*)style="[^"]*text-align:\s*center[^"]*"([^>]*)>/gi, '<section$2style="text-align:center"$3>')
          html = html.replace(/<\/section>\s*<\/p>/gi, '</section>')
          
          outputHtml.value = html
        } finally {
          // 清理临时 DOM 元素
          document.body.removeChild(tmpDiv)
        }
      }
    }
  }

  return {
    outputHtml,
    previewContainer,
    render,
  }
}
