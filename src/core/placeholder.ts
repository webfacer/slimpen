import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { isEmptyDoc } from './html'

/** Shows a faint placeholder text while the document is empty. */
export function placeholderPlugin(text: string): Plugin {
  return new Plugin({
    props: {
      decorations(state) {
        if (!text || !isEmptyDoc(state.doc)) return null

        return DecorationSet.create(state.doc, [
          Decoration.node(0, state.doc.firstChild!.nodeSize, {
            class: 'sp-placeholder',
            'data-placeholder': text,
          }),
        ])
      },
    },
  })
}
