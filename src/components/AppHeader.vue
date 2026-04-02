<script setup lang="ts">
import { usePharmacyStore } from '@/stores/pharmacy'
import { useGeolocation } from '@/composables/useGeolocation'

const emit = defineEmits<{
  locate: [lat: number, lng: number]
  toggleSidebar: []
}>()

const store = usePharmacyStore()
const { isLocating, locationError, locate } = useGeolocation()

async function handleLocate() {
  try {
    const coords = await locate()
    emit('locate', coords.latitude, coords.longitude)
  } catch {
    // locationError is set inside the composable
  }
}
</script>

<template>
  <header class="bg-green-700 text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0 z-10">
    <div class="flex items-center gap-3">
      <button
        class="sm:hidden rounded border border-white/30 px-2 py-1 text-xs"
        @click="emit('toggleSidebar')"
      >
        清單
      </button>
      <span class="text-lg font-bold tracking-tight">台灣藥局口罩地圖</span>
      <span class="hidden sm:inline text-xs opacity-70 bg-green-800 px-2 py-0.5 rounded">即時庫存查詢</span>
    </div>
    <div class="flex items-center gap-2">
      <span
        v-if="locationError"
        class="hidden sm:inline text-xs text-red-300"
      >{{ locationError }}</span>
      <button
        class="flex items-center gap-1.5 bg-white text-green-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        :disabled="isLocating || store.isLoading"
        @click="handleLocate"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke-width="2"
          />
          <path
            stroke-width="2"
            d="M12 2v3m0 14v3M2 12h3m14 0h3"
          />
        </svg>
        <span>{{ isLocating ? '定位中...' : '定位我的位置' }}</span>
      </button>
    </div>
  </header>
</template>
