/**
 * 标题样式组合配置
 * 每个组合包含一级到六级标题的完整样式定义
 * 颜色使用主题色 primary
 */

export const headingStyles = {
  classic: {
    name: '经典',
    description: '大中小标题层次分明，简洁专业',
    generate: (primary, font, size) => `
      h1 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.5)}px; 
        font-weight: bold; 
        margin-top: 24px; 
        margin-bottom: 12px; 
        color: ${primary}; 
        border-bottom: 2px solid ${primary}; 
        padding-bottom: 8px; 
      }
      h2 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.3)}px; 
        font-weight: bold; 
        margin-top: 20px; 
        margin-bottom: 10px; 
        color: #333; 
        border-left: 4px solid ${primary}; 
        padding-left: 12px; 
      }
      h3 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.15)}px; 
        font-weight: bold; 
        margin-top: 18px; 
        margin-bottom: 8px; 
        color: #333; 
        border-left: 3px solid ${primary}66;
        padding-left: 10px;
      }
      h4 { 
        font-family: ${font}; 
        font-size: ${size}px; 
        font-weight: bold; 
        margin-top: 16px; 
        margin-bottom: 8px; 
        color: #444; 
      }
      h5 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 0.9)}px; 
        font-weight: bold; 
        margin-top: 14px; 
        margin-bottom: 6px; 
        color: #555; 
      }
      h6 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 0.85)}px; 
        font-weight: bold; 
        margin-top: 12px; 
        margin-bottom: 6px; 
        color: #666; 
      }
    `,
  },

  geek: {
    name: '极客',
    description: '赛博朋克风格，科技感十足',
    generate: (primary, font, size) => `
      h1 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.5)}px; 
        font-weight: bold; 
        margin-top: 26px; 
        margin-bottom: 14px; 
        color: ${primary};
        letter-spacing: 1px;
        position: relative;
        padding-bottom: 8px;
      }
      h1::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: repeating-linear-gradient(90deg, ${primary} 0px, ${primary} 6px, transparent 6px, transparent 10px);
      }
      h2 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.3)}px; 
        font-weight: bold; 
        margin-top: 20px; 
        margin-bottom: 10px; 
        color: ${primary};
        letter-spacing: 0.5px;
        border-bottom: 2px solid ${primary}33;
        padding-bottom: 4px;
      }
      h2::before {
        content: "▸ ";
        color: ${primary};
      }
      h3 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.15)}px; 
        font-weight: bold; 
        margin-top: 18px; 
        margin-bottom: 8px; 
        color: #333;
        letter-spacing: 0.5px;
        border-bottom: 1px dashed ${primary}66;
        padding-bottom: 4px;
      }
      h4 { 
        font-family: ${font}; 
        font-size: ${size}px; 
        font-weight: bold; 
        margin-top: 16px; 
        margin-bottom: 8px; 
        color: ${primary};
        display: inline-block;
        border: 1px solid ${primary};
        padding: 2px 10px;
        border-radius: 4px;
      }
      h5 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 0.9)}px; 
        font-weight: bold; 
        margin-top: 14px; 
        margin-bottom: 6px; 
        color: #555;
        padding-left: 10px;
        border-left: 2px solid ${primary}44;
      }
      h6 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 0.85)}px; 
        font-weight: 600; 
        margin-top: 12px; 
        margin-bottom: 6px; 
        color: #777;
        font-style: italic;
      }
    `,
  },

  tech: {
    name: '科技',
    description: '渐变效果，现代感强',
    generate: (primary, font, size) => `
      h1 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.5)}px; 
        font-weight: bold; 
        margin-top: 26px; 
        margin-bottom: 14px; 
        color: ${primary};
        position: relative;
        padding-bottom: 8px;
      }
      h1::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, ${primary}, transparent);
        border-radius: 2px;
      }
      h2 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.3)}px; 
        font-weight: bold; 
        margin-top: 20px; 
        margin-bottom: 10px; 
        color: ${primary};
        background: linear-gradient(90deg, ${primary}22, transparent);
        padding: 8px 12px;
        border-radius: 4px;
      }
      h3 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.15)}px; 
        font-weight: bold; 
        margin-top: 18px; 
        margin-bottom: 8px; 
        color: #333;
        background: linear-gradient(90deg, ${primary}11, transparent);
        padding-left: 10px;
        border-left: 3px solid ${primary};
      }
      h4 { 
        font-family: ${font}; 
        font-size: ${size}px; 
        font-weight: bold; 
        margin-top: 16px; 
        margin-bottom: 8px; 
        color: ${primary};
      }
      h5 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 0.9)}px; 
        font-weight: bold; 
        margin-top: 14px; 
        margin-bottom: 6px; 
        color: #555;
        opacity: 0.9;
      }
      h6 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 0.85)}px; 
        font-weight: bold; 
        margin-top: 12px; 
        margin-bottom: 6px; 
        color: #666;
        opacity: 0.8;
      }
    `,
  },

  elegant: {
    name: '优雅',
    description: '衬线风格，书卷气息',
    generate: (primary, font, size) => `
      h1 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.5)}px; 
        font-weight: bold; 
        margin-top: 26px; 
        margin-bottom: 14px; 
        color: ${primary};
        text-align: center;
        padding-bottom: 10px;
        position: relative;
      }
      h1::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 2px;
        background: ${primary};
      }
      h2 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.3)}px; 
        font-weight: bold; 
        margin-top: 20px; 
        margin-bottom: 10px; 
        color: #333;
        text-align: center;
      }
      h3 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.15)}px; 
        font-weight: bold; 
        margin-top: 18px; 
        margin-bottom: 8px; 
        color: ${primary};
        font-style: italic;
      }
      h4 { 
        font-family: ${font}; 
        font-size: ${size}px; 
        font-weight: bold; 
        margin-top: 16px; 
        margin-bottom: 8px; 
        color: #444;
      }
      h5 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 0.9)}px; 
        font-weight: bold; 
        margin-top: 14px; 
        margin-bottom: 6px; 
        color: #555;
      }
      h6 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 0.85)}px; 
        font-weight: bold; 
        margin-top: 12px; 
        margin-bottom: 6px; 
        color: #777;
        font-style: italic;
      }
    `,
  },

  minimal: {
    name: '极简',
    description: '简洁明了，回归本质',
    generate: (primary, font, size) => `
      h1 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.5)}px; 
        font-weight: bold; 
        margin-top: 24px; 
        margin-bottom: 12px; 
        color: ${primary};
      }
      h2 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.25)}px; 
        font-weight: bold; 
        margin-top: 20px; 
        margin-bottom: 10px; 
        color: ${primary};
      }
      h3 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.1)}px; 
        font-weight: bold; 
        margin-top: 16px; 
        margin-bottom: 8px; 
        color: #333;
      }
      h4 { 
        font-family: ${font}; 
        font-size: ${size}px; 
        font-weight: bold; 
        margin-top: 14px; 
        margin-bottom: 8px; 
        color: #333;
      }
      h5 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 0.9)}px; 
        font-weight: 600; 
        margin-top: 12px; 
        margin-bottom: 6px; 
        color: #555;
      }
      h6 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 0.85)}px; 
        font-weight: 600; 
        margin-top: 10px; 
        margin-bottom: 6px; 
        color: #666;
      }
    `,
  },

  card: {
    name: '卡片',
    description: '标题带背景，突出层次',
    generate: (primary, font, size) => `
      h1 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.4)}px; 
        font-weight: bold; 
        margin-top: 24px; 
        margin-bottom: 12px; 
        color: #fff;
        background: ${primary};
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 2px 8px ${primary}44;
      }
      h2 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.2)}px; 
        font-weight: bold; 
        margin-top: 20px; 
        margin-bottom: 10px; 
        color: ${primary};
        background: ${primary}15;
        padding: 8px 14px;
        border-radius: 6px;
        border-left: 4px solid ${primary};
      }
      h3 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 1.1)}px; 
        font-weight: bold; 
        margin-top: 16px; 
        margin-bottom: 8px; 
        color: #333;
        background: #f8f8f8;
        padding: 6px 10px;
        border-radius: 4px;
      }
      h4 { 
        font-family: ${font}; 
        font-size: ${size}px; 
        font-weight: bold; 
        margin-top: 14px; 
        margin-bottom: 8px; 
        color: ${primary};
        padding-left: 10px;
        border-left: 3px solid ${primary}66;
      }
      h5 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 0.9)}px; 
        font-weight: bold; 
        margin-top: 12px; 
        margin-bottom: 6px; 
        color: #555;
      }
      h6 { 
        font-family: ${font}; 
        font-size: ${Math.round(size * 0.85)}px; 
        font-weight: bold; 
        margin-top: 10px; 
        margin-bottom: 6px; 
        color: #777;
      }
    `,
  },
}

export const headingStyleKeys = Object.keys(headingStyles)
