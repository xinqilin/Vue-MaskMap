<script setup lang="ts">
import { usePharmacyStore } from '@/stores/pharmacy'

const store = usePharmacyStore()
</script>

<template>
  <div
    v-if="store.isLoading"
    class="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 text-sm shrink-0"
  >
    <svg
      class="animate-spin h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    載入藥局資料中...
  </div>

  <div
    v-else-if="store.error"
    class="flex items-center justify-between px-4 py-2.5 bg-red-50 text-red-700 text-sm border-b border-red-100 shrink-0"
  >
    <span class="truncate">{{ store.error }}</span>
    <button
      class="ml-2 shrink-0 underline hover:no-underline font-medium"
      @click="store.fetchPharmacies()"
    >
      重試
    </button>
  </div>

  <div
    v-else-if="store.features.length > 0"
    class="px-3 py-2 bg-amber-50 text-amber-700 text-xs border-b border-amber-100 shrink-0"
  >
    注意：口罩實名制已結束，此資料僅供練習展示，數值不代表實際庫存。
  </div>
</template>
