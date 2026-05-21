<template>
  <div>
    <!-- Edit Mode Controls -->
    <transition name="fade">
      <div v-if="editMode" class="fixed top-0 left-0 right-0 bg-green-900 text-white p-4 z-50 shadow-lg">
        <div class="w-full max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h3 class="font-bold text-lg">Resume Editor</h3>
            <p class="text-xs text-green-100">Drag sections to reorganize • Toggle visibility • Type "edit" again to exit</p>
          </div>
          <button
            @click="editMode = false"
            class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold transition"
          >
            ✕ Exit Edit Mode
          </button>
        </div>
      </div>
    </transition>

    <main class="w-full max-w-4xl mx-auto px-6 py-10" :class="{ 'mt-24': editMode }">
      <!-- Section Controls (shown in edit mode) -->
      <div v-if="editMode" class="mb-6 p-4 bg-gray-100 rounded-lg">
        <h4 class="font-bold mb-3 text-sm">Section Visibility:</h4>
        <div class="grid grid-cols-2 gap-3">
          <label
            v-for="section in sections"
            :key="section.id"
            class="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              v-model="section.visible"
              class="w-4 h-4"
            />
            <span class="text-sm">{{ section.label }}</span>
          </label>
        </div>
      </div>

      <!-- Draggable Sections -->
      <template v-for="section in visibleSections" :key="section.id">
        <div
          :draggable="editMode"
          @dragstart="handleDragStart"
          @dragover="handleDragOver"
          @drop="handleDrop"
          :data-section-id="section.id"
          class="transition"
          :class="{ 'opacity-50 cursor-move border-l-4 border-green-900 pl-2': draggedSectionId === section.id, 'cursor-grab hover:bg-green-50': editMode }"
        >
          <component :is="section.component" />
        </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw, provide } from 'vue'
import { useKeySequence } from '@/composables/useKeySequence'
import ResumeHeader from '@/components/Resume/ResumeHeader.vue'
import ResumeSummary from '@/components/Resume/ResumeSummary.vue'
import ResumeSkills from '@/components/Resume/ResumeSkills.vue'
import ResumeExperience from '@/components/Resume/ResumeExperience.vue'
import ResumeProjects from '@/components/Resume/ResumeProjects.vue'
import ResumeCertifications from '@/components/Resume/ResumeCertifications.vue'
import ResumeEducation from '@/components/Resume/ResumeEducation.vue'
import ResumeLanguages from '@/components/Resume/ResumeLanguages.vue'

const editMode = ref(false)
const draggedSectionId = ref<string | null>(null)
const resetTrigger = ref(0)

// Provide editMode and resetTrigger to child components
provide('editMode', editMode)
provide('resetTrigger', resetTrigger)

// Initialize key sequence detector
useKeySequence('edit', () => {
  editMode.value = !editMode.value
})

// Detect reset sequence
useKeySequence('reset', () => {
  // Reset section visibility
  sections.value.forEach(s => {
    if (s.id !== 'header') {
      s.visible = true
    }
  })
  // Trigger reset in all child components
  resetTrigger.value++
})

const sections = ref([
  { id: 'header', label: 'Header', component: markRaw(ResumeHeader), visible: true },
  { id: 'summary', label: 'Summary', component: markRaw(ResumeSummary), visible: true },
  { id: 'experience', label: 'Experience', component: markRaw(ResumeExperience), visible: true },
  { id: 'education', label: 'Education', component: markRaw(ResumeEducation), visible: true },
  { id: 'certifications', label: 'Certifications', component: markRaw(ResumeCertifications), visible: true },
  { id: 'languages', label: 'Languages', component: markRaw(ResumeLanguages), visible: true },
  { id: 'projects', label: 'Projects', component: markRaw(ResumeProjects), visible: true },
  { id: 'skills', label: 'Skills', component: markRaw(ResumeSkills), visible: true },
])

const visibleSections = computed(() => {
  return sections.value.filter(s => s.visible || s.id === 'header')
})

const handleDragStart = (event: DragEvent) => {
  const sectionId = (event.target as HTMLElement).getAttribute('data-section-id')
  draggedSectionId.value = sectionId
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const targetId = (event.target as HTMLElement).getAttribute('data-section-id')

  if (draggedSectionId.value && targetId && draggedSectionId.value !== targetId) {
    const draggedIndex = sections.value.findIndex(s => s.id === draggedSectionId.value)
    const targetIndex = sections.value.findIndex(s => s.id === targetId)

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedSection] = sections.value.splice(draggedIndex, 1)
      sections.value.splice(targetIndex, 0, draggedSection)
    }
  }

  draggedSectionId.value = null
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

<style scoped>
main {
  color: #171717;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px;
  line-height: 1.48;
}
</style>
