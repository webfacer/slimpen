import { describe, expect, it } from 'vitest'
import { schema } from '../src/core/schema'
import { parseHTML, serializeHTML } from '../src/core/html'

const roundTrip = (html: string) => serializeHTML(parseHTML(html, schema))

describe('HTML in/out', () => {
  it('keeps supported markup', () => {
    const html = '<h2>Title</h2><p>Some <strong>bold</strong> and <em>italic</em> text.</p>'
    expect(roundTrip(html)).toBe(html)
  })

  it('returns an empty string for an empty document', () => {
    expect(roundTrip('')).toBe('')
    expect(roundTrip('<p></p>')).toBe('')
  })

  it('drops scripts, inline styles and unknown attributes', () => {
    expect(roundTrip('<p style="color:red" onclick="x()">Hi<script>alert(1)</script></p>')).toBe('<p>Hi</p>')
  })

  it('unwraps unknown inline tags but keeps their text', () => {
    expect(roundTrip('<p><span class="foo">Hello</span> <font>world</font></p>')).toBe('<p>Hello world</p>')
  })

  it('keeps alignment as a class', () => {
    expect(roundTrip('<p class="sp-align-center">Centered</p>')).toBe('<p class="sp-align-center">Centered</p>')
    expect(roundTrip('<h3 class="sp-align-right">Right</h3>')).toBe('<h3 class="sp-align-right">Right</h3>')
  })

  it('maps H1 to H2 and H4–H6 to H3', () => {
    expect(roundTrip('<h1>A</h1><h5>B</h5>')).toBe('<h2>A</h2><h3>B</h3>')
  })

  it('keeps lists, quotes and code blocks', () => {
    const html =
      '<ul><li><p>One</p></li></ul><blockquote><p>Quote</p></blockquote><pre><code class="language-js">let a = 1</code></pre>'
    expect(roundTrip(html)).toBe(html)
  })
})
