# slimpen – Spec

A slim WYSIWYG editor for Vue 3. The text is the interface: no toolbar, no chrome. Formatting UI only appears when it is needed and disappears as soon as you keep writing.

## Goals

- **Calm UI** – nothing on screen except the text and the cursor.
- **Easy integration** – `<SlimPen v-model="html" />` and done.
- **Clean output** – only allowlisted HTML, safe to render on public pages.
- **No external requests** – no fonts, scripts or images loaded from third parties. Inherits fonts from the host app.

## Non-goals (v1)

- SSR / Nuxt server rendering (client-only; import must not touch `window`/`document`, so `<ClientOnly>` works).
- Mobile / touch support.
- Small bundle size (calm UI matters, kilobytes do not).
- Collaboration, comments, track changes.

## Target

Backend / admin panels (CMS, content management). Desktop, keyboard-heavy users.

## Output

`v-model` is an **HTML string**. The editor only emits tags and attributes from the schema:

| Content | HTML |
|---|---|
| Paragraph | `<p>` |
| Headings | `<h2>`, `<h3>` |
| Bold / italic | `<strong>`, `<em>` |
| Link | `<a href>` (only `http:`, `https:`, `mailto:`, relative URLs) |
| Lists | `<ul>`, `<ol>`, `<li>` |
| Quote | `<blockquote>` |
| Code block | `<pre><code class="language-*">` |
| Inline code | `<code>` |
| Image | `<img src alt>` |
| Table | `<table>`, `<tr>`, `<th>`, `<td>` |
| Divider | `<hr>` |
| Alignment | `class="sp-align-center"` / `sp-align-right` on blocks |

Incoming HTML (initial value, paste) is parsed against the same schema – unknown tags and attributes are dropped. Hosts should still sanitize on the server.

## UI

### 1. Bubble menu (on text selection)

Appears after the selection is finished (mouseup / Shift released), fades in (~100 ms), sits above the selection. Hides on typing, click outside, `Esc`.

| # | Button | Shortcut |
|---|---|---|
| 1 | Bold | `Ctrl+B` |
| 2 | Italic | `Ctrl+I` |
| 3 | Link (inline input inside the bubble) | `Ctrl+K` |
| 4 | Heading – cycles paragraph → H2 → H3 | `Ctrl+Alt+2/3` |
| 5 | Alignment – cycles left → center → right | `Ctrl+Shift+L/E/R` |

Context-aware: inside a table it shows row/column actions, on an image alt text / replace, in a code block the language.

### 2. Slash menu (`/` on an empty line)

Small filterable list: Image, Table, Code block, Bullet list, Numbered list, Quote, Divider. Typing filters (`/tab` → Table), `Enter` inserts, `Esc` closes.

### 3. Markdown shortcuts (while typing)

`## ` heading, `- ` / `* ` bullet list, `1. ` numbered list, `> ` quote, ```` ``` ```` code block, `---` divider, `**text**` bold, `*text*` italic, `` `code` `` inline code.

### Other

- Placeholder (`placeholder` prop), fades out on first input.
- Images: drag & drop, paste, slash menu → host-provided `upload(file) => Promise<url>`. No upload function → image insertion is disabled.
- Theming via CSS variables (`--sp-*`), light + dark.
- Optional focus mode prop: dims all blocks except the current one.

## API (Vue)

```vue
<SlimPen
  v-model="html"
  placeholder="Start writing…"
  :upload="uploadImage"
  :editable="true"
  :focus-mode="false"
  @focus="…"
  @blur="…"
/>
```

## Architecture

- **Core** (`slimpen`) – framework-agnostic TypeScript on ProseMirror. `createEditor(element, options)` returns an instance with `getHTML()`, `setHTML()`, `destroy()`, events.
- **Vue wrapper** (`slimpen/vue`) – thin component around the core. Vue is an optional peer dependency.
- Positioning of menus: `@floating-ui/dom`.
- Build: Vite library mode, ESM + type declarations. Tests: Vitest.

## Milestones

1. Core editor + schema + HTML in/out + Vue wrapper + demo page
2. Bubble menu (bold, italic, link, heading, alignment)
3. Markdown shortcuts + paste cleanup
4. Slash menu + lists, quote, code block, divider
5. Images (upload hook)
6. Tables
7. Theming, dark mode, focus mode, docs, first npm release
