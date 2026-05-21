<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useItemEditor } from '@/composables/useItemEditor'
import { formatDescription } from '@/composables/useDescriptionFormatter'

const { messages, locale } = useI18n()
const editMode = inject<any>('editMode', ref(false))
const resetTrigger = inject<any>('resetTrigger', ref(0))

const experienceList = computed(() => {
  return (messages.value[locale.value] as any)?.experience || []
})

const itemCount = computed(() => experienceList.value.length)

const {
  toggleItemVisibility,
  visibleItemIndices,
  handleItemDragStart,
  handleItemDragOver,
  handleItemDrop,
  isItemHidden,
  draggedItemIndex,
  reset,
} = useItemEditor(itemCount)

// Listen for reset signal
watch(resetTrigger, () => {
  reset()
})
</script>

<template>
  <section class="my-7">
    <h2 class="text-xl font-bold mb-3 pb-1.5 border-b border-gray-300 text-green-900">
      {{ $t('sections.experience') }}
    </h2>
    <div class="grid grid-cols-1">
      <article
        v-for="originalIdx in (visibleItemIndices as any[])"
        :key="originalIdx"
        :draggable="editMode"
        @dragstart="handleItemDragStart(originalIdx)"
        @dragover="handleItemDragOver"
        @drop="handleItemDrop(originalIdx)"
        :data-item-index="originalIdx"
        class="space-y-2 transition pt-1 pb-1"
        :class="{
          'border-t border-gray-300': originalIdx !== 0,
          'opacity-50 cursor-move border-l-4 border-green-900 pl-2': draggedItemIndex === originalIdx,
          'cursor-grab': editMode
        }"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <h3 class="text-base font-bold mt-1 mb-1">{{ experienceList[originalIdx].company }} - {{ experienceList[originalIdx].position }}</h3>
            <p class="text-gray-600 text-xs font-bold">{{ experienceList[originalIdx].period }} · {{ experienceList[originalIdx].location }}</p>
            <p class="text-sm leading-relaxed" v-html="formatDescription(experienceList[originalIdx].description)"></p>
          </div>
          <div v-if="editMode" class="flex gap-2 print:hidden">
            <button
              @click="toggleItemVisibility(originalIdx)"
              :title="isItemHidden(originalIdx) ? 'Show' : 'Hide'"
              class="px-2 py-1 text-xs rounded transition"
              :class="isItemHidden(originalIdx)
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'"
            >
              {{ isItemHidden(originalIdx) ? '👁️' : '🚫' }}
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
article p {
  margin: 0;
}
</style>
