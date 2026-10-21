import { EditorState, type Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { history, undo, redo } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap, toggleMark } from 'prosemirror-commands'
import { splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { tableEditing } from 'prosemirror-tables'
import { schema } from './schema'
import { parseHTML, serializeHTML } from './html'
import { placeholderPlugin } from './placeholder'

export interface EditorOptions {
  /** Initial HTML content. */
  content?: string
  placeholder?: string
  editable?: boolean
  onChange?: (html: string) => void
  onFocus?: () => void
  onBlur?: () => void
}

export interface SlimPenEditor {
  readonly view: EditorView
  getHTML(): string
  setHTML(html: string): void
  setEditable(editable: boolean): void
  focus(): void
  destroy(): void
}

function createPlugins(options: EditorOptions): Plugin[] {
  const listItem = schema.nodes.list_item

  return [
    history(),
    keymap({
      'Mod-z': undo,
      'Mod-y': redo,
      'Shift-Mod-z': redo,
      'Mod-b': toggleMark(schema.marks.strong),
      'Mod-i': toggleMark(schema.marks.em),
      'Mod-e': toggleMark(schema.marks.code),
      Enter: splitListItem(listItem),
      Tab: sinkListItem(listItem),
      'Shift-Tab': liftListItem(listItem),
    }),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    tableEditing(),
    placeholderPlugin(options.placeholder ?? ''),
  ]
}

export function createEditor(element: HTMLElement, options: EditorOptions = {}): SlimPenEditor {
  let editable = options.editable ?? true
  const plugins = createPlugins(options)

  const createState = (html: string) =>
    EditorState.create({ doc: parseHTML(html, schema), plugins })

  const view = new EditorView(element, {
    state: createState(options.content ?? ''),
    editable: () => editable,
    attributes: { class: 'slimpen-content' },
    dispatchTransaction(transaction) {
      view.updateState(view.state.apply(transaction))
      if (transaction.docChanged) options.onChange?.(serializeHTML(view.state.doc))
    },
    handleDOMEvents: {
      focus: () => {
        options.onFocus?.()
        return false
      },
      blur: () => {
        options.onBlur?.()
        return false
      },
    },
  })

  return {
    view,
    getHTML: () => serializeHTML(view.state.doc),
    // Replaces the whole document (and undo history) without firing onChange.
    setHTML: (html) => view.updateState(createState(html)),
    setEditable(value) {
      editable = value
      view.setProps({})
    },
    focus: () => view.focus(),
    destroy: () => view.destroy(),
  }
}
