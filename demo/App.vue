<script setup lang="ts">
import { ref } from 'vue'
import { SlimPen } from '../src/vue'

const html = ref(
  '<h2>Hello slimpen</h2><p>Just start writing. The text is the interface.</p>' +
    '<p class="sp-align-center">This line is centered.</p>' +
    '<ul><li><p>Lists</p></li><li><p>work too</p></li></ul>',
)
const showOutput = ref(false)
</script>

<template>
  <main class="page">
    <SlimPen v-model="html" placeholder="Start writing…" />

    <footer class="debug">
      <label><input v-model="showOutput" type="checkbox" /> show HTML output</label>
      <pre v-if="showOutput">{{ html }}</pre>
    </footer>
  </main>
</template>

<style>
.page {
  max-width: 680px;
  margin: 12vh auto;
  padding: 0 16px;
  font-size: 1.125rem;
}

.debug {
  margin-top: 6rem;
  font-size: 0.8rem;
  opacity: 0.5;
}

.debug pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
