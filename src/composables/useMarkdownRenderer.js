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
import { inlineStyles, inlineSvgStyles } from '../utils/inlineStyles'
import { imageUnwrapPlugin, forceTightListPlugin } from '../utils/markdown-it-plugins'
import { fontFamilies } from './useEditorState'

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

  const defaultFence = md.renderer.rules.fence
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const info = token.info.trim()
    if (info === 'mermaid') {
      const id = `mermaid-${Date.now()}-${idx}`
      return `<div class="mermaid" id="${id}" style="text-align: center; margin: 10px auto;">${token.content}</div>`
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

      const imgMargin = captionText ? '0 auto' : '10px auto'
      const imgHtml = `<img src="${esc(src)}" alt="${esc(alt)}"${title ? ` title="${esc(title)}"` : ''} style="max-width:100%; height:auto; display:block; margin:${imgMargin}; border-radius:4px;" />`

      if (captionText) {
        return `<figure style="margin:10px 0; text-align:center;">${imgHtml}<figcaption style="font-size:13px; color:#666; margin-top:6px;">${esc(captionText)}</figcaption></figure>`
      }
      return imgHtml
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

    outputHtml.value = inlineStyles(rawHtml, combinedCss)

    await nextTick()
    setTimeout(async () => {
      if (!previewContainer.value) return

      const mermaidDivs = previewContainer.value.querySelectorAll('.mermaid')
      if (mermaidDivs.length === 0) return

      try {
        mermaid.initialize({ startOnLoad: false, theme: 'neutral', fontSize: 14, securityLevel: 'loose' })
      } catch (e) {
        console.warn('Mermaid re-initialization warning:', e)
      }

      for (const div of mermaidDivs) {
        const id = div.id
        const content = div.textContent || ''
        try {
          if (!content.trim()) return
          const svgId = id + '-svg-' + Date.now()
          const { svg } = await mermaid.render(svgId, content)
          div.innerHTML = svg
          const svgEl = div.querySelector('svg')
          if (svgEl) {
            const inlinedSvg = inlineSvgStyles(svgEl)
            div.innerHTML = inlinedSvg
            const finalSvgEl = div.querySelector('svg')
            if (finalSvgEl) {
              const textElements = finalSvgEl.querySelectorAll('text')
              textElements.forEach(textEl => {
                if (!textEl.style.fontSize) {
                  textEl.style.fontSize = '14px'
                }
                if (!textEl.style.fontFamily) {
                  textEl.style.fontFamily = fontFamilies[currentFont] || 'sans-serif'
                }
              })

              const vb = finalSvgEl.getAttribute('viewBox')
              let heightPx = ''
              if (vb) {
                const parts = vb.trim().split(/[,\s]+/)
                if (parts.length === 4) {
                  const vbW = parseFloat(parts[2])
                  const vbH = parseFloat(parts[3])
                  if (vbW > 0 && vbH > 0) {
                    const renderW = Math.min(vbW, 677)
                    heightPx = `${Math.round(vbH * renderW / vbW)}px`
                  }
                }
              }
              if (heightPx) finalSvgEl.setAttribute('height', heightPx)
              else finalSvgEl.removeAttribute('height')
              finalSvgEl.style.display = 'block'
              finalSvgEl.style.margin = '0 auto'
            }
          }
        } catch (e) {
          console.error('Mermaid render error for id ' + id, e)
          div.innerHTML = `<p style=" color:red; font-size:12px;">Mermaid Error: ${e}</p>`
        }
      }
    }, 100)
  }

  return {
    outputHtml,
    previewContainer,
    render,
  }
}
