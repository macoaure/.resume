<template>
  <header class="border-b-2 border-green-900 pb-5 mb-7">
    <h1 class="text-3xl font-bold mb-2 tracking-tight">{{ $t('header.name') }}</h1>
    <p class="text-green-900 text-lg font-bold mb-3">{{ $t('header.headline') }}</p>
    <p class="text-gray-600 text-sm">
      {{ $t('header.location') }} · {{ $t('header.remote') }} ·
      <a :href="`mailto:${email}`" class="hover:text-green-900">{{ email }}</a>
      · <a :href="`tel:${phone}`" class="hover:text-green-900">{{ phone }}</a>
      · <a :href="`https://www.linkedin.com/in/${linkedin}`" class="hover:text-green-900">{{ linkedin }}</a>
    </p>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { messages, locale } = useI18n()

const email = computed(() => {
  return (messages.value[locale.value] as any)?.header?.email || 'macosaures@gmail.com'
})

const phone = computed(() => {
  return (messages.value[locale.value] as any)?.header?.phone || '+55 43 99912-3668'
})

const linkedin = computed(() => {
  return (messages.value[locale.value] as any)?.header?.linkedin || 'macoaure'
})
</script>

<style scoped>
a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
