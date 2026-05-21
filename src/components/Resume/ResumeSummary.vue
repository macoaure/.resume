<template>
  <section class="my-7">
    <h2 class="text-xl font-bold mb-3 pb-1.5 border-b border-gray-300 text-green-900">
      {{ $t('sections.summary') }}
    </h2>
    <div class="space-y-3 text-sm leading-relaxed">
      <p>{{ $t('professional_summary.paragraph1') }}</p>
      <p>{{ $t('professional_summary.paragraph2') }}</p>
      <p>{{ $t('professional_summary.paragraph3') }}</p>
    </div>
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
