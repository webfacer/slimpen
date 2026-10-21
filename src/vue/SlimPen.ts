import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createEditor, type SlimPenEditor } from '../core/editor'

export const SlimPen = defineComponent({
  name: 'SlimPen',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    editable: { type: Boolean, default: true },
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  setup(props, { emit }) {
    const root = ref<HTMLElement>()
    let editor: SlimPenEditor | null = null

    onMounted(() => {
      editor = createEditor(root.value!, {
        content: props.modelValue,
        placeholder: props.placeholder,
        editable: props.editable,
        onChange: (html) => emit('update:modelValue', html),
        onFocus: () => emit('focus'),
        onBlur: () => emit('blur'),
      })
    })

    // Only external changes reach the editor – our own emits come back identical.
    watch(
      () => props.modelValue,
      (html) => {
        if (editor && html !== editor.getHTML()) editor.setHTML(html)
      },
    )

    watch(
      () => props.editable,
      (editable) => editor?.setEditable(editable),
    )

    onBeforeUnmount(() => {
      editor?.destroy()
      editor = null
    })

    return () => h('div', { ref: root, class: 'slimpen' })
  },
})
