<template>
  <section class="my-7">
    <h2 class="text-xl font-bold mb-3 pb-1.5 border-b border-gray-300 text-green-900">
      {{ $t('sections.skills') }}
    </h2>
    <ul class="space-y-2 text-sm leading-relaxed list-disc list-inside">
      <li>{{ $t('skills_details.backend') }}</li>
      <li>{{ $t('skills_details.architecture') }}</li>
      <li>{{ $t('skills_details.data') }}</li>
      <li>{{ $t('skills_details.integration') }}</li>
      <li>{{ $t('skills_details.cloud') }}</li>
      <li>{{ $t('skills_details.observability') }}</li>
      <li>{{ $t('skills_details.leadership') }}</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
// Component setup
</script>

<style scoped>
p {
  margin: 0;
}
</style>
