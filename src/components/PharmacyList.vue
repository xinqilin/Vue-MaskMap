<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePharmacyStore } from '@/stores/pharmacy'
import PharmacyCard from './PharmacyCard.vue'
import type { PharmacyFeature } from '@/types'

const emit = defineEmits<{
  select: [pharmacy: PharmacyFeature]
}>()

const store = usePharmacyStore()
const { filteredPharmacies, selectedArea, isLoading, selectedPharmacyId } = storeToRefs(store)
</script>

<template>
  <div
    v-if="!selectedArea && !isLoading"
    class="flex flex-col items-center justify-center py-12 text-sm text-gray-400 gap-2"
  >
    <svg
      class="w-8 h-8 opacity-40"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
    <span>請選擇地區以查看藥局</span>
  </div>

  <div
    v-else-if="filteredPharmacies.length === 0 && !isLoading"
    class="flex items-center justify-center py-12 text-sm text-gray-400"
  >
    此地區無資料
  </div>

  <ul v-else>
    <PharmacyCard
      v-for="pharmacy in filteredPharmacies"
      :key="pharmacy.properties.id"
      :pharmacy="pharmacy"
      :selected="selectedPharmacyId === pharmacy.properties.id"
      @select="emit('select', $event)"
    />
  </ul>
</template>
