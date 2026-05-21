<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const toggleLanguage = () => {
  locale.value = locale.value === 'pt-br' ? 'en-us' : 'pt-br'
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="fixed top-4 right-4 z-50 print:hidden">
      <button
        @click="toggleLanguage"
        class="px-4 py-2 bg-green-900 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-medium"
      >
        {{ locale === 'pt-br' ? 'EN' : 'PT' }}
      </button>
    </div>
    <RouterView />
  </div>
</template>

<style>
:root {
  --text: #171717;
  --muted: #555555;
  --border: #d7d7d7;
  --accent: #14532d;
  --soft: #f7f9f8;
  --bg: #ffffff;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
}
</style>
