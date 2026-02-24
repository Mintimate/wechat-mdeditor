
import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'
import markdownItIns from 'markdown-it-ins'
import markdownItMark from 'markdown-it-mark'
import markdownItSub from 'markdown-it-sub'
import markdownItSup from 'markdown-it-sup'
import markdownItTaskLists from 'markdown-it-task-lists'
import mermaid from 'mermaid'
import { nextTick, ref } from 'vue'
import { codeBlockStyles, fonts } from '../config'
import { inlineStyles } from '../utils/inlineStyles'
import { forceTightListPlugin, imageUnwrapPlugin, rubyPlugin, swipeImagesPlugin } from '../utils/markdown-it-plugins'

// inline computed styles for SVG elements (used before rasterizing)
function inlineSvgElementStyles(svgEl) {
  const svgProperties = [
    'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin',
    'font-family', 'font-size', 'font-weight', 'font-style', 'text-anchor',
    'dominant-baseline', 'alignment-baseline', 'opacity', 'fill-opacity', 'stroke-opacity',
    'marker-start', 'marker-mid', 'marker-end', 'marker'
  ]
  const allElements = svgEl.querySelectorAll('*')
  allElements.forEach(el => {
    if (!(el instanceof SVGElement)) return
    const computed = window.getComputedStyle(el)
    svgProperties.forEach(prop => {
      const val = computed.getPropertyValue(prop)
      if (val && val !== 'none' && val !== 'auto' && val !== 'inherit' && val !== '') {
        el.style.setProperty(prop, val)
      }
    })
  })
}

// 将 SVG 转换为 Base64 图片
async function svgToImage(svgEl) {
  let outputWidth = 800, outputHeight = 600
  const vb = svgEl.getAttribute('viewBox')
  if (vb) {
    const parts = vb.trim().split(/[\s,]+/).map(parseFloat)
    if (parts.length === 4) {
      outputWidth = parts[2]
      outputHeight = parts[3]
    }
  }
  const attrWidth = svgEl.getAttribute('width')
  const attrHeight = svgEl.getAttribute('height')
  if (attrWidth && attrWidth.endsWith('px')) outputWidth = parseFloat(attrWidth)
  if (attrHeight && attrHeight.endsWith('px')) outputHeight = parseFloat(attrHeight)

  const maxRenderWidth = Math.min(outputWidth, 2000)
  const scale = 2
  const canvas = document.createElement('canvas')
  canvas.width = maxRenderWidth * scale
  canvas.height = outputHeight * scale
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.scale(scale, scale)

  const svgData = new XMLSerializer().serializeToString(svgEl)
  const img = new Image()
  const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData)
  return new Promise((resolve, reject) => {
    img.onload = () => {
      try {
        ctx.drawImage(img, 0, 0, maxRenderWidth, outputHeight)
        resolve(canvas.toDataURL('image/png'))
      } catch (err) {
        console.error('Canvas drawImage error', err)
        reject(err)
      }
    }
    img.onerror = e => {
      console.error('SVG Image loading failed', e)
      reject(new Error('SVG Image loading failed'))
    }
    img.src = svgUrl
  })
}

export function useMarkdownRenderer() {
  const outputHtml = ref('')
  const previewContainer = ref(null)

  const md = new MarkdownIt({ html: true, linkify: true, typographer: true })

  md.use(markdownItTaskLists)
  md.use(imageUnwrapPlugin)
  md.use(forceTightListPlugin)
  md.use(rubyPlugin)
  md.use(swipeImagesPlugin)
  md.use(markdownItIns)
  md.use(markdownItMark)
  md.use(markdownItSub)
  md.use(markdownItSup)

  // 自定义列表渲染，手动添加列表符号（微信公众号不支持 list-style）
  md.renderer.rules.bullet_list_open = () => {
    return '<ul style="margin:0; padding:0 0 0 12px; list-style:none;">'
  }

  md.renderer.rules.bullet_list_close = () => {
    return '</ul>'
  }

  md.renderer.rules.ordered_list_open = (tokens, idx, options, env) => {
    const start = tokens[idx].attrGet('start') || 1
    if (!env._orderedCounters) env._orderedCounters = []
    env._orderedCounters.push(start)
    return '<ol style="margin:0; padding:0 0 0 12px; list-style:none;">'
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

  // 表格渲染：包裹在可横向滚动的容器中
  md.renderer.rules.table_open = () => {
    return '<section style="width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 10px 0;"><table style="border-collapse: collapse; width: 100%; display: table; font-size: 14px; min-width: max-content;">'
  }

  md.renderer.rules.table_close = () => {
    return '</table></section>'
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

  // highlight.js 颜色映射（基于 github-light 主题）
  const hljsColors = {
    'comment': { color: '#6a737d', fontStyle: 'italic' },
    'quote': { color: '#6a737d', fontStyle: 'italic' },
    'keyword': { color: '#d73a49' },
    'selector-tag': { color: '#d73a49' },
    'subst': { color: '#24292e' },
    'number': { color: '#005cc5' },
    'literal': { color: '#005cc5' },
    'variable': { color: '#e36209' },
    'template-variable': { color: '#e36209' },
    'tag': { color: '#22863a' },
    'name': { color: '#22863a' },
    'selector-id': { color: '#f97583' },
    'selector-class': { color: '#f97583' },
    'regexp': { color: '#032f62' },
    'deletion': { color: '#b31d28', backgroundColor: '#ffeef0' },
    'addition': { color: '#22863a', backgroundColor: '#f0fff4' },
    'built_in': { color: '#e36209' },
    'builtin-name': { color: '#e36209' },
    'type': { color: '#6f42c1' },
    'class': { color: '#6f42c1' },
    'function': { color: '#6f42c1' },
    'params': { color: '#24292e' },
    'property': { color: '#005cc5' },
    'attribute': { color: '#e36209' },
    'punctuation': { color: '#24292e' },
    'string': { color: '#032f62' },
    'symbol': { color: '#e36209' },
    'bullet': { color: '#005cc5' },
    'link': { color: '#032f62', textDecoration: 'underline' },
    'meta': { color: '#6a737d' },
    'meta-keyword': { color: '#d73a49' },
    'meta-string': { color: '#032f62' },
    'emphasis': { fontStyle: 'italic' },
    'strong': { fontWeight: 'bold' },
    'title': { color: '#22863a' },
    'section': { color: '#22863a' }
  }

  // 内联代码高亮样式
  function inlineHighlightStyles(html) {
    // 匹配带有 hljs class 的 span 标签
    return html.replace(/<span class="hljs-([a-z0-9-]+)"([^>]*)>/gi, (match, className, rest) => {
      const styles = []
      const colorInfo = hljsColors[className]
      if (colorInfo) {
        if (colorInfo.color) {
          styles.push(`color:${colorInfo.color}`)
        }
        if (colorInfo.fontStyle) {
          if (colorInfo.fontStyle === 'italic') {
            styles.push('font-style:italic')
          } else if (colorInfo.fontStyle === 'bold') {
            styles.push('font-weight:bold')
          }
        }
        if (colorInfo.backgroundColor) {
          styles.push(`background-color:${colorInfo.backgroundColor}`)
        }
      }
      return styles.length > 0 
        ? `<span class="hljs-${className}" style="${styles.join(';')}">` 
        : `<span class="hljs-${className}"${rest}>`
    })
  }

  const render = async (opts) => {
    const { input, codeBlockStyle, imageCaptionMode, currentFont, wechatStyle, themeTertiary, fancyMode, themePrimary } = opts
    const tertiaryColor = themeTertiary || '#ea7c4d'
    const primaryColor = themePrimary || '#f97316'

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

        // 内联高亮样式
        content = inlineHighlightStyles(content)

        // 使用配置中的代码块样式
        const styleConfig = codeBlockStyles[codeBlockStyle]
        const fontFamily = fonts[currentFont]?.value || fonts.sans.value
        if (styleConfig && styleConfig.highlightPre) {
          return styleConfig.highlightPre(content, fontFamily)
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
        const linkText = a.textContent || ''
        if (!linkIndex.has(href)) {
          linkIndex.set(href, { index: linkIndex.size + 1, text: linkText })
          links.push({ url: href, text: linkText })
        }
        const { index: number } = linkIndex.get(href)
        const span = document.createElement('span')
        span.className = 'ref-text'
        span.innerHTML = a.innerHTML
        const sup = document.createElement('sup')
        sup.className = 'ref-mark'
        sup.textContent = `[${number}]`
        sup.setAttribute('style', `font-size:12px; color:${tertiaryColor}; vertical-align:super; margin-left:4px;`)
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
        links.forEach((link, i) => {
          const li = document.createElement('li')
          li.setAttribute('style', 'font-size:13px; color:#666; margin:6px 0; word-break:break-all; line-height:1.6;')
          const numSpan = document.createElement('span')
          numSpan.textContent = `[${i + 1}] `
          const textSpan = document.createElement('span')
          textSpan.textContent = link.text ? `${link.text}: ` : ''
          const urlSpan = document.createElement('span')
          urlSpan.style.fontStyle = 'italic'
          urlSpan.textContent = link.url
          li.appendChild(numSpan)
          if (link.text) li.appendChild(textSpan)
          li.appendChild(urlSpan)
          ul.appendChild(li)
        })
        tmp.appendChild(ul)
      }
      rawHtml = tmp.innerHTML
    }

    const combinedCss = wechatStyle

    const styledHtml = inlineStyles(rawHtml, combinedCss)
    
    // Fancy 模式格子背景样式
    let fancyBgStyle = ''
    if (fancyMode && primaryColor) {
      // 将十六进制颜色转换为 rgba
      const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
      }
      
      // 使用淡灰色格子（类似掘金风格），但带一点点主题色调
      const gridColor = hexToRgba(primaryColor, 0.06)
      const gridAccent = hexToRgba(primaryColor, 0.03)
      
      fancyBgStyle = `
        background-image: linear-gradient(0deg, transparent 24%, ${gridColor} 25%, ${gridAccent} 26%, transparent 27%, transparent 74%, ${gridColor} 75%, ${gridAccent} 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, ${gridColor} 25%, ${gridAccent} 26%, transparent 27%, transparent 74%, ${gridColor} 75%, ${gridAccent} 76%, transparent 77%, transparent);
        background-size: 50px 50px;
        background-color: #ffffff;
        padding-bottom: 30px;
      `
    }
    
    // 用 section 包裹内容，符合微信公众号编辑器规范
    const paddingStyle = 'padding: 0;'
    const baseHtml = `<section style="font-family: ${fonts[currentFont]?.value || 'sans-serif'}; font-size: 16px; line-height: 1.75; color: #3f3f3f; ${paddingStyle} ${fancyBgStyle}">${styledHtml}</section>`
    outputHtml.value = baseHtml

    await nextTick()
    
    // 处理 mermaid 渲染
    if (typeof document !== 'undefined') {
      const mermaidDivs = styledHtml.match(/class="mermaid"/g)
      if (mermaidDivs && mermaidDivs.length > 0) {

        try {
          mermaid.initialize({ startOnLoad: false, theme: 'default' })
        } catch (e) {
          console.warn('Mermaid init warning:', e)
        }

        // 创建一个隐藏的临时容器，插入到 DOM 中以便 getComputedStyle 能工作
        const tmpDiv = document.createElement('div')
        tmpDiv.style.position = 'absolute'
        tmpDiv.style.left = '-9999px'
        tmpDiv.style.top = '-9999px'
        tmpDiv.style.width = '800px'
        tmpDiv.style.zIndex = '-1' 
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
                svgEl.style.backgroundColor = 'transparent'
                
                // 内联 styles 之前不需要修改 innerHTML 进行颜色替换，因为内联后会失效或者冲突，
                // 应该依赖 inlineSvgElementStyles 或者 mermaid config。
                // 不过 doocs/md 是内联后改的？查看 history... 
                
                // 内联 SVG 中所有元素的样式（关键：必须在 DOM 中才能获取计算样式）
                inlineSvgElementStyles(svgEl)
                
                // 设置字体
                const textElements = svgEl.querySelectorAll('text')
                textElements.forEach(textEl => {
                  textEl.style.fontFamily = fonts[currentFont]?.value || 'sans-serif'
                })

                // 修复 mermaid 部分文本颜色被 stroke 覆盖的问题
                svgEl.innerHTML = svgEl.innerHTML.replace(
                  /<tspan([^>]*)>/g,
                  `<tspan$1 style="fill: #333 !important; color: #333 !important; stroke: none !important;">`
                )
                
                // 优化时序图 actor（端点）对比度：设置更明显的背景色和深色标签
                try {
                  const actorRects = svgEl.querySelectorAll('rect.actor, rect[class*="actor-"]')
                  actorRects.forEach(rect => {
                    // 使用浅灰背景以保证与文本形成对比
                    if (!rect.getAttribute('data-actor-adjusted')) {
                      rect.style.fill = '#f6f7fa'
                      rect.style.stroke = rect.style.stroke || 'rgba(0,0,0,0.12)'
                      rect.setAttribute('data-actor-adjusted', '1')
                    }
                  })

                  // 将 actor 文本设为深色，并移除描边
                  const actorTexts = svgEl.querySelectorAll('text.actor, text[class*="actor-"]')
                  actorTexts.forEach(textEl => {
                    const tspans = textEl.querySelectorAll('tspan')
                    tspans.forEach(tspan => {
                      tspan.style.fill = '#111'
                      tspan.style.color = '#111'
                      tspan.style.stroke = 'none'
                    })
                    // 同步 text 元素自身的填充
                    textEl.style.fill = defaultThemeVariables?.primaryTextColor || '#111'
                  })
                } catch (e) {
                  console.warn('actor contrast adjust failed', e)
                }

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
                    span.style.fontFamily = fonts[currentFont]?.value || 'sans-serif'
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
                
                // 转换为图片
                const dataUrl = await svgToImage(svgEl)
                const img = document.createElement('img')
                img.src = dataUrl
                img.style.maxWidth = '100%'
                img.style.height = 'auto'
                img.style.display = 'block'
                img.style.margin = '0 auto'

                // 创建新的 section 包裹 SVG
                const newSection = document.createElement('section')
                newSection.style.textAlign = 'center'
                newSection.style.margin = '1em auto'
                newSection.appendChild(img)
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
