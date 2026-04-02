<script setup lang="ts">
import { computed } from 'vue'
import type { PharmacyFeature } from '@/types'

const props = defineProps<{
  pharmacy: PharmacyFeature
  selected?: boolean
}>()

const emit = defineEmits<{
  select: [pharmacy: PharmacyFeature]
}>()

const p = computed(() => props.pharmacy.properties)
const hasStock = computed(() => p.value.mask_adult > 0 || p.value.mask_child > 0)
const mapsUrl = computed(() => `https://www.google.com.tw/maps/place/${encodeURIComponent(p.value.address)}`)
</script>

<template>
  <li
    class="px-4 py-3 cursor-pointer transition-all border-b border-gray-100 last:border-b-0"
    :class="[
      hasStock ? 'bg-[#e9ffe3]' : 'bg-white',
      selected ? 'ring-2 ring-inset ring-green-600' : 'hover:brightness-95',
    ]"
    @click="emit('select', pharmacy)"
  >
    <h3 class="font-semibold text-gray-800 text-sm truncate">
      {{ p.name }}
    </h3>
    <p class="text-xs text-gray-600 mt-0.5">
      成人：<span :class="p.mask_adult > 0 ? 'text-green-600 font-semibold' : 'text-gray-400'">{{ p.mask_adult }}</span>
      &nbsp;|&nbsp;
      兒童：<span :class="p.mask_child > 0 ? 'text-green-600 font-semibold' : 'text-gray-400'">{{ p.mask_child }}</span>
    </p>
    <p class="text-xs text-gray-500 mt-0.5 truncate">
      <a
        :href="mapsUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-green-600 underline"
        @click.stop
      >
        {{ p.address }}
      </a>
    </p>
  </li>
</template>
