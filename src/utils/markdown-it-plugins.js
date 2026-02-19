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
