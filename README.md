# slimpen

A slim, calm WYSIWYG editor – plain JavaScript core with an optional Vue 3 component. The text is the interface – formatting only appears when you select text, and disappears as soon as you keep writing.

> Early development. See [SPEC.md](SPEC.md) for the plan.

## Install

```bash
npm install slimpen
```

slimpen works with plain JavaScript in any project. Vue is optional – use `slimpen/vue` if you want the ready-made component.

## Usage – plain JavaScript

```js
import { createEditor } from 'slimpen'
import 'slimpen/style.css'

const editor = createEditor(document.querySelector('#editor'), {
  content: '<p>Hello</p>',
  placeholder: 'Start writing…',
  onChange: (html) => console.log(html),
})

editor.getHTML()
editor.setHTML('<p>New content</p>')
editor.setEditable(false)
editor.destroy()
```

## Usage – Vue 3

```vue
<script setup>
import { ref } from 'vue'
import { SlimPen } from 'slimpen/vue'
import 'slimpen/style.css'

const html = ref('')
</script>

<template>
  <SlimPen v-model="html" placeholder="Start writing…" />
</template>
```

The editor is client-only. In Nuxt, wrap it in `<ClientOnly>`.

## Development

```bash
npm install
npm run dev        # demo page
npm test           # unit tests
npm run typecheck
npm run build      # library build to dist/
```

## License

MIT
