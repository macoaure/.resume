<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useItemEditor } from '@/composables/useItemEditor'
import certificatesData from '@/data/certificates.json'

const { t } = useI18n()
const editMode = inject<any>('editMode', ref(false))
const resetTrigger = inject<any>('resetTrigger', ref(0))

const certificationsList = computed(() => {
  return certificatesData || []
})

const itemCount = computed(() => certificationsList.value.length)

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
      {{ $t('sections.certifications') }}
    </h2>

    <!-- Certifications list -->
    <div v-if="certificationsList.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
      <div
        v-for="originalIdx in (visibleItemIndices as any[])"
        :key="originalIdx"
        :draggable="editMode"
        @dragstart="handleItemDragStart(originalIdx)"
        @dragover="handleItemDragOver"
        @drop="handleItemDrop(originalIdx)"
        :data-item-index="originalIdx"
        class="flex items-start justify-between gap-3 transition"
        :class="{
          'opacity-50 cursor-move border-l-4 border-green-900 pl-2': draggedItemIndex === originalIdx,
          'cursor-grab': editMode
        }"
      >
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-900">
            {{ certificationsList[originalIdx].title }}
          </p>
          <p class="text-gray-600">
            {{ certificationsList[originalIdx].organization }} • {{ certificationsList[originalIdx].issuedDate }}
          </p>
          <a
            v-if="certificationsList[originalIdx].link"
            :href="certificationsList[originalIdx].link"
            target="_blank"
            rel="noopener noreferrer"
            class="text-green-700 hover:text-green-900 text-xs underline"
          >
            {{ $t('common.view_credential') || 'View Credential' }}
          </a>
        </div>
        <button
          v-if="editMode"
          @click="toggleItemVisibility(originalIdx)"
          :title="isItemHidden(originalIdx) ? 'Show' : 'Hide'"
          class="px-2 py-1 text-xs rounded transition flex-shrink-0"
          :class="isItemHidden(originalIdx)
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-green-100 text-green-700 hover:bg-green-200'"
        >
          {{ isItemHidden(originalIdx) ? '👁️' : '🚫' }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
p {
  margin: 0;
}
</style>
