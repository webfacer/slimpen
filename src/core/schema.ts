import { Schema, type NodeSpec, type MarkSpec, type Attrs } from 'prosemirror-model'
import { nodes as basicNodes, marks as basicMarks } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { tableNodes } from 'prosemirror-tables'
import { isSafeUrl } from './safe-url'

export type Align = 'left' | 'center' | 'right'

const ALIGN_CLASS_PREFIX = 'sp-align-'

function parseAlign(dom: HTMLElement): Align {
  if (dom.classList.contains(`${ALIGN_CLASS_PREFIX}center`)) return 'center'
  if (dom.classList.contains(`${ALIGN_CLASS_PREFIX}right`)) return 'right'
  return 'left'
}

function alignAttrs(align: Align): Attrs {
  return align === 'left' ? {} : { class: `${ALIGN_CLASS_PREFIX}${align}` }
}

const paragraph: NodeSpec = {
  content: 'inline*',
  group: 'block',
  attrs: { align: { default: 'left' } },
  parseDOM: [{ tag: 'p', getAttrs: (dom) => ({ align: parseAlign(dom) }) }],
  toDOM: (node) => ['p', alignAttrs(node.attrs.align), 0],
}

// Only H2 and H3 – H1 belongs to the page title, deeper levels are folded into H3.
const heading: NodeSpec = {
  content: 'inline*',
  group: 'block',
  defining: true,
  attrs: { level: { default: 2 }, align: { default: 'left' } },
  parseDOM: [
    { tag: 'h1', getAttrs: (dom) => ({ level: 2, align: parseAlign(dom) }) },
    { tag: 'h2', getAttrs: (dom) => ({ level: 2, align: parseAlign(dom) }) },
    { tag: 'h3', getAttrs: (dom) => ({ level: 3, align: parseAlign(dom) }) },
    { tag: 'h4', getAttrs: (dom) => ({ level: 3, align: parseAlign(dom) }) },
    { tag: 'h5', getAttrs: (dom) => ({ level: 3, align: parseAlign(dom) }) },
    { tag: 'h6', getAttrs: (dom) => ({ level: 3, align: parseAlign(dom) }) },
  ],
  toDOM: (node) => [`h${node.attrs.level}`, alignAttrs(node.attrs.align), 0],
}

const codeBlock: NodeSpec = {
  content: 'text*',
  marks: '',
  group: 'block',
  code: true,
  defining: true,
  attrs: { language: { default: null } },
  parseDOM: [
    {
      tag: 'pre',
      preserveWhitespace: 'full',
      getAttrs: (dom) => {
        const match = dom.querySelector('code')?.className.match(/language-([\w-]+)/)
        return { language: match ? match[1] : null }
      },
    },
  ],
  toDOM: (node) => [
    'pre',
    ['code', node.attrs.language ? { class: `language-${node.attrs.language}` } : {}, 0],
  ],
}

const image: NodeSpec = {
  group: 'block',
  draggable: true,
  attrs: { src: {}, alt: { default: '' } },
  parseDOM: [
    {
      tag: 'img[src]',
      getAttrs: (dom) => {
        const src = dom.getAttribute('src') ?? ''
        return isSafeUrl(src) ? { src, alt: dom.getAttribute('alt') ?? '' } : false
      },
    },
  ],
  toDOM: (node) => ['img', { src: node.attrs.src, alt: node.attrs.alt }],
}

const link: MarkSpec = {
  attrs: { href: {} },
  inclusive: false,
  parseDOM: [
    {
      tag: 'a[href]',
      getAttrs: (dom) => {
        const href = dom.getAttribute('href') ?? ''
        return isSafeUrl(href) ? { href } : false
      },
    },
  ],
  toDOM: (mark) => ['a', { href: mark.attrs.href }, 0],
}

const baseNodes = {
  doc: basicNodes.doc,
  paragraph,
  blockquote: basicNodes.blockquote,
  horizontal_rule: basicNodes.horizontal_rule,
  heading,
  code_block: codeBlock,
  image,
  text: basicNodes.text,
  hard_break: basicNodes.hard_break,
}

const withLists = addListNodes(
  new Schema({ nodes: baseNodes }).spec.nodes,
  'paragraph block*',
  'block',
)

const withTables = withLists.append(
  tableNodes({ tableGroup: 'block', cellContent: 'block+', cellAttributes: {} }),
)

export const schema = new Schema({
  nodes: withTables,
  marks: {
    link,
    em: basicMarks.em,
    strong: basicMarks.strong,
    code: basicMarks.code,
  },
})
