<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePharmacyStore } from '@/stores/pharmacy'

const store = usePharmacyStore()
const {
  selectedCity,
  selectedArea,
  cities,
  currentAreas,
  isLoading,
  searchQuery,
  sortBy,
  inStockOnly,
} = storeToRefs(store)

function onCityChange() {
  selectedArea.value = ''
}
</script>

<template>
  <div class="p-3 bg-white border-b border-gray-200 shrink-0">
    <div class="flex items-center gap-2 mb-2">
      <label
        for="citySelect"
        class="w-10 text-sm font-medium text-gray-600 shrink-0"
      >縣市</label>
      <select
        id="citySelect"
        v-model="selectedCity"
        class="flex-1 text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 bg-white"
        :disabled="isLoading"
        @change="onCityChange"
      >
        <option value="">
          -- 請選擇 --
        </option>
        <option
          v-for="city in cities"
          :key="city.CityName"
          :value="city.CityName"
        >
          {{ city.CityName }}
        </option>
      </select>
    </div>
    <div class="flex items-center gap-2">
      <label
        for="areaSelect"
        class="w-10 text-sm font-medium text-gray-600 shrink-0"
      >地區</label>
      <select
        id="areaSelect"
        v-model="selectedArea"
        class="flex-1 text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 bg-white"
        :disabled="isLoading || !selectedCity"
      >
        <option value="">
          -- 請選擇 --
        </option>
        <option
          v-for="area in currentAreas"
          :key="area.AreaName"
          :value="area.AreaName"
        >
          {{ area.AreaName }}
        </option>
      </select>
    </div>
    <div class="mt-3 space-y-2">
      <input
        v-model.trim="searchQuery"
        type="search"
        placeholder="搜尋藥局名稱或地址"
        class="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 bg-white"
        :disabled="isLoading"
      >
      <div class="flex items-center gap-2">
        <select
          v-model="sortBy"
          class="flex-1 text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
          :disabled="isLoading"
        >
          <option value="name">
            依名稱排序
          </option>
          <option value="adult">
            成人庫存高到低
          </option>
          <option value="child">
            兒童庫存高到低
          </option>
        </select>
        <label class="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
          <input
            v-model="inStockOnly"
            type="checkbox"
            class="rounded border-gray-300 text-green-600 focus:ring-green-500"
            :disabled="isLoading"
          >
          只看有庫存
        </label>
      </div>
    </div>
    <p class="mt-2 text-xs text-gray-400 text-right">
      綠色標記表示還有口罩庫存
    </p>
  </div>
</template>
