<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePharmacyStore } from '@/stores/pharmacy'
import AppHeader from '@/components/AppHeader.vue'
import PharmacySidebar from '@/components/PharmacySidebar.vue'
import PharmacyMap from '@/components/PharmacyMap.vue'
import type { PharmacyFeature } from '@/types'

const store = usePharmacyStore()
const mapRef = ref<InstanceType<typeof PharmacyMap> | null>(null)
const isMobileSidebarOpen = ref(false)

onMounted(() => {
  store.fetchPharmacies()
})

function onPharmacySelect(pharmacy: PharmacyFeature): void {
  store.setSelectedPharmacy(pharmacy)
  mapRef.value?.panTo(pharmacy)
  isMobileSidebarOpen.value = false
}

function onLocate(lat: number, lng: number): void {
  mapRef.value?.locateUser(lat, lng)
}

function toggleSidebar(): void {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <AppHeader
      @locate="onLocate"
      @toggle-sidebar="toggleSidebar"
    />
    <div class="flex flex-1 overflow-hidden">
      <div class="w-80 shrink-0 hidden sm:flex flex-col">
        <PharmacySidebar @select="onPharmacySelect" />
      </div>
      <div class="flex-1 relative">
        <PharmacyMap ref="mapRef" />
        <div
          v-if="isMobileSidebarOpen"
          class="absolute inset-0 z-[500] bg-black/35 sm:hidden"
          @click="isMobileSidebarOpen = false"
        />
        <div
          class="absolute inset-x-0 bottom-0 z-[600] max-h-[75vh] transform transition-transform duration-200 sm:hidden"
          :class="isMobileSidebarOpen ? 'translate-y-0' : 'translate-y-full'"
        >
          <div class="mx-3 mb-3 h-[70vh] overflow-hidden rounded-2xl shadow-2xl">
            <PharmacySidebar
              mobile
              @select="onPharmacySelect"
              @close="isMobileSidebarOpen = false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
