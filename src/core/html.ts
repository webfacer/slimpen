import { DOMParser, DOMSerializer, type Node, type Schema } from 'prosemirror-model'

/**
 * Parses an HTML string into a document. Anything the schema doesn't know
 * (scripts, inline styles, unknown tags/attributes) is dropped here.
 */
export function parseHTML(html: string, schema: Schema): Node {
  const template = document.createElement('template')
  template.innerHTML = html
  return DOMParser.fromSchema(schema).parse(template.content)
}

/** Serializes a document to HTML. An empty document returns an empty string. */
export function serializeHTML(doc: Node): string {
  if (isEmptyDoc(doc)) return ''

  const container = document.createElement('div')
  container.appendChild(DOMSerializer.fromSchema(doc.type.schema).serializeFragment(doc.content))
  return container.innerHTML
}

export function isEmptyDoc(doc: Node): boolean {
  const first = doc.firstChild
  return doc.childCount === 1 && first !== null && first.type.name === 'paragraph' && first.content.size === 0
}
