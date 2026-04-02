<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { usePharmacyStore } from '@/stores/pharmacy'
import { useMap } from '@/composables/useMap'
import type { PharmacyFeature } from '@/types'

const store = usePharmacyStore()
const { init, setMarkers, panTo: mapPanTo, focusMarker, showUserLocation } = useMap()

onMounted(() => {
  init('map')
})

watch(
  () => store.filteredPharmacies,
  (pharmacies) => {
    setMarkers(pharmacies)
    if (
      store.selectedPharmacy &&
      pharmacies.some((pharmacy) => pharmacy.properties.id === store.selectedPharmacyId)
    ) {
      focusMarker(store.selectedPharmacy)
    }
  },
)

watch(
  () => store.selectedPharmacy,
  (pharmacy) => {
    if (
      pharmacy &&
      store.filteredPharmacies.some((item) => item.properties.id === pharmacy.properties.id)
    ) {
      focusMarker(pharmacy)
    }
  },
)

function panTo(pharmacy: PharmacyFeature): void {
  store.setSelectedPharmacy(pharmacy)
  mapPanTo(pharmacy)
}

function locateUser(lat: number, lng: number): void {
  showUserLocation(lat, lng)
  const nearest = store.findNearest(lat, lng)
  if (nearest) {
    store.selectedCity = nearest.properties.county
    store.selectedArea = nearest.properties.town
    store.setSelectedPharmacy(nearest)
  }
}

defineExpose({ panTo, locateUser })
</script>

<template>
  <div
    id="map"
    class="h-full w-full"
  />
</template>
