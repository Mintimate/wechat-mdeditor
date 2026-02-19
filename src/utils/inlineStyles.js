// Simple CSS parser and inliner for browser environment

function calculateSpecificity(selector) {
  let ids = 0
  let classes = 0
  let tags = 0
  const baseSelector = selector.split(':')[0]
  const idMatches = baseSelector.match(/#[a-zA-Z0-9_-]+/g)
  if (idMatches) ids = idMatches.length
  const classMatches = baseSelector.match(/\.[a-zA-Z0-9_-]+/g)
  if (classMatches) classes = classMatches.length
  let tempExpression = baseSelector.replace(/#[a-zA-Z0-9_-]+/g, '').replace(/\.[a-zA-Z0-9_-]+/g, '')
  tempExpression = tempExpression.replace(/[>+~]/g, ' ')
  const parts = tempExpression.split(/\s+/).filter(p => p.length > 0 && p !== '*')
  tags = parts.length
  return [ids, classes, tags]
}

export function parseCSS(css) {
  const rules = []
  const cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const tasks = cleanCss.split('}')
  let order = 0
  for (const task of tasks) {
    if (!task.trim()) continue
    const [selectorPart, stylePart] = task.split('{')
    if (!selectorPart || !stylePart) continue
    const selectors = selectorPart.split(',').map(s => s.trim())
    const declarations = {}
    stylePart.split(';').forEach(decl => {
      const [prop, val] = decl.split(':')
      if (prop && val) declarations[prop.trim()] = val.trim()
    })
    if (Object.keys(declarations).length === 0) continue
    for (const selector of selectors) {
      rules.push({ selector, declarations, specificity: calculateSpecificity(selector), order: order++ })
    }
  }
  return rules
}

export function inlineStyles(html, css) {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    console.warn('inlineStyles function requires a browser environment (DOMParser). Returning original HTML.')
    return html
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const rules = parseCSS(css)
  rules.sort((a, b) => {
    if (a.specificity[0] !== b.specificity[0]) return a.specificity[0] - b.specificity[0]
    if (a.specificity[1] !== b.specificity[1]) return a.specificity[1] - b.specificity[1]
    if (a.specificity[2] !== b.specificity[2]) return a.specificity[2] - b.specificity[2]
    return a.order - b.order
  })

  const originalStyles = new Map()
  doc.querySelectorAll('*').forEach(el => {
    if (el instanceof HTMLElement && el.hasAttribute('style')) originalStyles.set(el, el.getAttribute('style') || '')
  })

  for (const rule of rules) {
    try {
      if (rule.selector.includes(':hover') || rule.selector.includes(':active') || rule.selector.includes(':focus') || rule.selector.includes('::')) continue
      const elements = doc.querySelectorAll(rule.selector)
      elements.forEach(node => {
        const htmlEl = node
        for (const prop in rule.declarations) {
          const value = rule.declarations[prop]
          const isImportant = value.toLowerCase().includes('!important')
          const cleanValue = value.replace(/!important/i, '').trim()
          const priority = isImportant ? 'important' : ''
          if (htmlEl.style && htmlEl.style.setProperty) htmlEl.style.setProperty(prop, cleanValue, priority)
        }
      })
    } catch (e) {}
  }

  originalStyles.forEach((originalStyle, el) => {
    el.setAttribute('style', el.style.cssText + '; ' + originalStyle)
  })

  return doc.body.innerHTML
}

export function inlineSvgStyles(element) {
  if (!element || !(element instanceof SVGElement)) return ''
  const allElements = element.querySelectorAll('*')
  const properties = [
    'fill', 'stroke', 'stroke-width', 'font-family', 'font-size', 'font-weight', 'opacity', 'stroke-dasharray', 'text-anchor', 'alignment-baseline', 'dominant-baseline',
  ]
  allElements.forEach(el => {
    if (!(el instanceof SVGElement)) return
    const computed = window.getComputedStyle(el)
    properties.forEach(prop => {
      const val = computed.getPropertyValue(prop)
      if (val && val !== 'auto' && val !== 'inherit') el.style.setProperty(prop, val)
    })
  })

  const svgComputed = window.getComputedStyle(element)
  if (svgComputed.backgroundColor === 'rgba(0, 0, 0, 0)' || svgComputed.backgroundColor === 'transparent') element.style.backgroundColor = '#ffffff'
  else element.style.backgroundColor = svgComputed.backgroundColor
  element.querySelectorAll('style').forEach(s => s.remove())
  element.style.maxWidth = '100%'
  element.style.height = 'auto'
  return element.outerHTML
}
