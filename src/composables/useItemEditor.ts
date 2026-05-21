import { ref, computed, watch } from 'vue'
import type { Ref, ComputedRef } from 'vue'

export function useItemEditor(itemCount: Ref<number> | ComputedRef<number> | number) {
  // Get the initial count
  const count = typeof itemCount === 'number' ? itemCount : itemCount.value

  // Track hidden items by index
  const hiddenItems = ref<Set<number>>(new Set())

  // Track item order
  const itemOrder = ref<number[]>(Array.from({ length: count }, (_, i) => i))

  // Item being dragged
  const draggedItemIndex = ref<number | null>(null)

  // Watch for item count changes and update order
  if (typeof itemCount !== 'number') {
    watch(
      () => itemCount.value,
      (newCount) => {
        const currentOrder = itemOrder.value.length
        if (newCount > currentOrder) {
          // Add new indices
          for (let i = currentOrder; i < newCount; i++) {
            itemOrder.value.push(i)
          }
        } else if (newCount < currentOrder) {
          // Remove indices beyond the new count
          itemOrder.value = itemOrder.value.filter(idx => idx < newCount)
          hiddenItems.value = new Set(
            Array.from(hiddenItems.value).filter(idx => idx < newCount)
          )
        }
      }
    )
  }

  // Toggle item visibility
  const toggleItemVisibility = (index: number) => {
    if (hiddenItems.value.has(index)) {
      hiddenItems.value.delete(index)
    } else {
      hiddenItems.value.add(index)
    }
  }

  // Get visible items in current order
  const visibleItemIndices = computed(() => {
    return itemOrder.value.filter(idx => !hiddenItems.value.has(idx))
  })

  // Handle drag start
  const handleItemDragStart = (index: number) => {
    draggedItemIndex.value = index
  }

  // Handle drag over
  const handleItemDragOver = (event: DragEvent) => {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }

  // Handle drop
  const handleItemDrop = (targetIndex: number) => {
    if (draggedItemIndex.value === null || draggedItemIndex.value === targetIndex) {
      draggedItemIndex.value = null
      return
    }

    const draggedOrder = itemOrder.value.indexOf(draggedItemIndex.value)
    const targetOrder = itemOrder.value.indexOf(targetIndex)

    if (draggedOrder !== -1 && targetOrder !== -1) {
      const [draggedItem] = itemOrder.value.splice(draggedOrder, 1)
      itemOrder.value.splice(targetOrder, 0, draggedItem)
    }

    draggedItemIndex.value = null
  }

  // Check if item is hidden
  const isItemHidden = (index: number) => hiddenItems.value.has(index)

  // Reset to original state
  const reset = () => {
    hiddenItems.value.clear()
    itemOrder.value = Array.from({ length: count }, (_, i) => i)
    draggedItemIndex.value = null
  }

  return {
    hiddenItems,
    itemOrder,
    draggedItemIndex,
    toggleItemVisibility,
    visibleItemIndices,
    handleItemDragStart,
    handleItemDragOver,
    handleItemDrop,
    isItemHidden,
    reset,
  }
}
