import MarkdownIt from 'markdown-it'

export const imageUnwrapPlugin = (md) => {
  md.core.ruler.push('image-unwrap', (state) => {
    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== 'paragraph_open') continue
      if (i + 2 >= tokens.length) break
      const open = tokens[i]
      const inline = tokens[i + 1]
      const close = tokens[i + 2]
      if (inline.type !== 'inline' || close.type !== 'paragraph_close') continue
      // 处理单独的图片或滑动图片
      if (inline.children && inline.children.length === 1) {
        const child = inline.children[0]
        if (child.type === 'image' || child.type === 'swipe_images') {
          open.hidden = true
          close.hidden = true
        }
      }
    }
  })
}

export const rubyPlugin = (md) => {
  // 匹配 {文字|读音} 格式
  const RUBY_REGEX = /\{([^|}]+)\|([^}]+)\}/g

  md.inline.ruler.before('emphasis', 'ruby', (state, silent) => {
    const pos = state.pos
    const src = state.src

    if (src.charCodeAt(pos) !== 0x7B /* { */) {
      return false
    }

    // 查找匹配的 {文字|读音} 模式
    const match = RUBY_REGEX.exec(src.slice(pos))
    if (!match || match.index !== 0) {
      RUBY_REGEX.lastIndex = 0 // 重置正则
      return false
    }

    if (silent) {
      return true
    }

    const text = match[1]
    const rt = match[2]

    const token = state.push('ruby', 'ruby', 0)
    token.content = text
    token.rt = rt
    token.markup = match[0]

    state.pos += match[0].length
    RUBY_REGEX.lastIndex = 0 // 重置正则

    return true
  })

  md.renderer.rules.ruby = (tokens, idx) => {
    const text = md.utils.escapeHtml(tokens[idx].content)
    const rt = md.utils.escapeHtml(tokens[idx].rt)
    // 微信公众号兼容的 ruby 标签
    return `<ruby style="ruby-align:center;">${text}<rp>(</rp><rt style="font-size:0.6em; color:#888;">${rt}</rt><rp>)</rp></ruby>`
  }
}

export const forceTightListPlugin = (md) => {
  md.core.ruler.push('force-tight-list', (state) => {
    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'list_item_open') {
        let depth = 0
        for (let j = i + 1; j < tokens.length; j++) {
          const token = tokens[j]
          if (token.type === 'bullet_list_open' || token.type === 'ordered_list_open') depth++
          else if (token.type === 'bullet_list_close' || token.type === 'ordered_list_close') depth--
          if (token.type === 'list_item_close' && depth === 0) break
          if (depth === 0) {
            if (token.type === 'paragraph_open') token.hidden = true
            if (token.type === 'paragraph_close') token.hidden = true
          }
        }
      }
    }
  })
}

/**
 * 滑动图片插件
 * 语法: <![alt](url),![alt](url),...>
 * 渲染为可横向滑动的图片容器
 */
export const swipeImagesPlugin = (md) => {
  // 匹配整个滑动图片语法
  const SWIPE_REGEX = /^<((?:!\[.*?\]\([^)]+\)\s*,?\s*)+)>$/

  md.inline.ruler.before('image', 'swipe_images', (state, silent) => {
    const pos = state.pos
    const src = state.src

    // 检查是否以 < 开头
    if (src.charCodeAt(pos) !== 0x3C /* < */) {
      return false
    }

    // 查找匹配的结束 >
    let endPos = pos + 1
    let found = false
    while (endPos < src.length) {
      if (src.charCodeAt(endPos) === 0x3E /* > */) {
        found = true
        break
      }
      endPos++
    }

    if (!found) {
      return false
    }

    const content = src.slice(pos, endPos + 1)

    // 检查是否匹配滑动图片格式
    if (!SWIPE_REGEX.test(content)) {
      return false
    }

    if (silent) {
      return true
    }

    // 提取图片信息
    const imageRegex = /!\[(.*?)\]\(([^)]+)\)/g
    const images = []
    let match
    while ((match = imageRegex.exec(content)) !== null) {
      images.push({
        alt: match[1] || '',
        src: match[2]
      })
    }

    if (images.length === 0) {
      return false
    }

    const token = state.push('swipe_images', 'swipe_images', 0)
    token.images = images
    token.markup = content

    state.pos = endPos + 1

    return true
  })

  md.renderer.rules.swipe_images = (tokens, idx) => {
    const images = tokens[idx].images
    const esc = md.utils.escapeHtml

    // 生成滑动容器，使用 section 包裹，微信公众号兼容
    const imageItems = images.map(img => {
      return `<section style="flex-shrink: 0; width: 100%; scroll-snap-align: start;"><img src="${esc(img.src)}" alt="${esc(img.alt)}" style="width: 100%; height: auto; display: block; border-radius: 8px; border: 1px solid rgba(0,0,0,0.04);" /></section>`
    }).join('')

    return `<section style="width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory; display: flex; gap: 8px; margin: 0; padding: 0; scrollbar-width: none;"><section style="display: flex; gap: 8px; width: max-content;">${imageItems}</section></section><section style="text-align: center; font-size: 12px; color: #888; margin: 4px 0 0 0;">&lt;&lt;&lt; 左右滑动见更多 &gt;&gt;&gt;</section>`
  }
}
