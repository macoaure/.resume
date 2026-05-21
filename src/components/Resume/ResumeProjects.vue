<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { useItemEditor } from '@/composables/useItemEditor'
import { formatDescription } from '@/composables/useDescriptionFormatter'
import projectsData from '@/data/projects.json'
const editMode = inject<any>('editMode', ref(false))
const resetTrigger = inject<any>('resetTrigger', ref(0))

const projectsList = computed(() => {
  return projectsData || []
})

const itemCount = computed(() => projectsList.value.length)

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
      Projects
    </h2>
    
    <!-- Projects list -->
    <div v-if="projectsList.length > 0" class="space-y-3">
      <div
        v-for="originalIdx in (visibleItemIndices as any[])"
        :key="originalIdx"
        :draggable="editMode"
        @dragstart="handleItemDragStart(originalIdx)"
        @dragover="handleItemDragOver"
        @drop="handleItemDrop(originalIdx)"
        :data-item-index="originalIdx"
        class="mb-4 flex items-start justify-between gap-3 transition"
        :class="{
          'opacity-50 cursor-move border-l-4 border-green-900 pl-2': draggedItemIndex === originalIdx,
          'cursor-grab': editMode
        }"
      >
        <div class="flex-1">
          <div class="flex items-start gap-3">
            <img
              v-if="projectsList[originalIdx].logoUrl"
              :src="projectsList[originalIdx].logoUrl"
              :alt="projectsList[originalIdx].organization"
              class="w-10 h-10 rounded-full flex-shrink-0 object-cover"
            />
            <div class="flex-1">
              <p class="font-semibold text-gray-900">
                {{ projectsList[originalIdx].title }}
              </p>
              <p class="text-sm text-gray-600">
                {{ projectsList[originalIdx].organization }}
              </p>
              <p class="text-xs text-gray-500">
                {{ projectsList[originalIdx].dates }}
              </p>
            </div>
          </div>
          <p class="text-sm text-gray-700 mt-2" v-html="formatDescription(projectsList[originalIdx].description)"></p>
          <div v-if="projectsList[originalIdx].skills && projectsList[originalIdx].skills.length > 0" class="mt-2 flex flex-wrap gap-1">
            <span
              v-for="(skill, idx) in projectsList[originalIdx].skills"
              :key="idx"
              class="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded"
            >
              {{ skill }}
            </span>
          </div>
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
