<template>
  <section class="my-7">
    <h2 class="text-xl font-bold mb-3 pb-1.5 border-b border-gray-300 text-green-900">
      {{ $t('sections.education') }}
    </h2>
    <div class="space-y-3 text-sm">
      <div v-for="(edu, idx) in (educationList as any[])" :key="idx" class="mb-3">
        <p class="font-semibold text-gray-900">
          {{ edu.title }}
        </p>
        <p class="text-gray-600">
          {{ edu.organization }}
        </p>
        <p class="text-gray-500 text-xs">
          {{ edu.issuedDate }}
        </p>
        <template v-if="edu.description">
          <p class="mt-1 text-gray-700" v-html="formatDescription(edu.description)"></p>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDescription } from '@/composables/useDescriptionFormatter'

const { messages, locale } = useI18n()

const educationList = computed(() => {
  return (messages.value[locale.value] as any)?.data?.education || []
})
</script>

<style scoped>
p {
  margin: 0;
}
</style>
