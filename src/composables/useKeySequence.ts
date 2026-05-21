import { ref, onMounted, onUnmounted } from 'vue'

export function useKeySequence(sequence: string, callback: () => void) {
  const currentSequence = ref('')

  const handleKeyPress = (event: KeyboardEvent) => {
    currentSequence.value += event.key.toLowerCase()

    // Keep only the last N characters where N is the sequence length
    if (currentSequence.value.length > sequence.length) {
      currentSequence.value = currentSequence.value.slice(-sequence.length)
    }

    // Check if the sequence matches
    if (currentSequence.value === sequence) {
      callback()
      currentSequence.value = ''
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyPress)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress)
  })

  return { currentSequence }
}
