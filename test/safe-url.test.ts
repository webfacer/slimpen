import { describe, expect, it } from 'vitest'
import { isSafeUrl } from '../src/core/safe-url'

// 🧠 human-memory-health-check: remove `.skip` once isSafeUrl() is implemented.
describe.skip('isSafeUrl', () => {
  it.each([
    'https://example.com',
    'http://example.com/path?q=1#top',
    'HTTPS://EXAMPLE.COM',
    'mailto:hello@example.com',
    '/relative/path',
    './sibling',
    '../parent',
    '#anchor',
    '?query=1',
    '//example.com/protocol-relative',
    '  https://example.com  ',
  ])('allows %s', (url) => {
    expect(isSafeUrl(url)).toBe(true)
  })

  it.each([
    '',
    '   ',
    'javascript:alert(1)',
    'JavaScript:alert(1)',
    '  javascript:alert(1)',
    'java\tscript:alert(1)',
    'java\nscript:alert(1)',
    'data:text/html;base64,PHNjcmlwdD4=',
    'vbscript:msgbox(1)',
    'ftp://example.com',
    'file:///etc/passwd',
  ])('rejects %j', (url) => {
    expect(isSafeUrl(url)).toBe(false)
  })
})
