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
      if (inline.children && inline.children.length === 1 && inline.children[0].type === 'image') {
        open.hidden = true
        close.hidden = true
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
