<script setup lang="ts">
import CityDistrictFilter from './CityDistrictFilter.vue'
import DataStatusBanner from './DataStatusBanner.vue'
import PharmacyList from './PharmacyList.vue'
import type { PharmacyFeature } from '@/types'

defineProps<{
  mobile?: boolean
}>()

const emit = defineEmits<{
  select: [pharmacy: PharmacyFeature]
  close: []
}>()
</script>

<template>
  <aside class="flex flex-col h-full overflow-hidden border-r border-gray-200 bg-white">
    <div
      v-if="mobile"
      class="flex items-center justify-between px-3 py-2 border-b border-gray-200 shrink-0"
    >
      <span class="text-sm font-semibold text-gray-800">藥局列表</span>
      <button
        class="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600"
        @click="emit('close')"
      >
        關閉
      </button>
    </div>
    <CityDistrictFilter />
    <DataStatusBanner />
    <div class="overflow-y-auto flex-1">
      <PharmacyList @select="emit('select', $event)" />
    </div>
  </aside>
</template>
