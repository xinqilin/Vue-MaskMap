import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ofetch } from 'ofetch'
import type {
  PharmacyFeature,
  PharmacyGeoJSON,
  PharmacyProperties,
  PharmacySort,
  TaiwanCity,
} from '@/types'
import taiwanData from '@/assets/Taiwan.json'
import { PHARMACY_API_URL } from '@/config'

function sanitizeText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.replace(/<[^>]*>/g, '').trim()
}

function sanitizeNumber(value: unknown): number {
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

function sanitizeFeature(raw: PharmacyFeature): PharmacyFeature {
  const p = raw.properties
  const sanitized: PharmacyProperties = {
    id: sanitizeText(p.id),
    name: sanitizeText(p.name),
    phone: sanitizeText(p.phone),
    address: sanitizeText(p.address),
    mask_adult: sanitizeNumber(p.mask_adult),
    mask_child: sanitizeNumber(p.mask_child),
    updated: sanitizeText(p.updated),
    available: sanitizeText(p.available),
    note: sanitizeText(p.note),
    custom_note: sanitizeText(p.custom_note),
    website: sanitizeText(p.website),
    county: sanitizeText(p.county),
    town: sanitizeText(p.town),
    cunli: sanitizeText(p.cunli),
    service_periods: sanitizeText(p.service_periods),
  }
  return { ...raw, properties: sanitized }
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export const usePharmacyStore = defineStore('pharmacy', () => {
  const features = ref<readonly PharmacyFeature[]>([])
  const selectedCity = ref('臺北市')
  const selectedArea = ref('大安區')
  const selectedPharmacyId = ref<string | null>(null)
  const searchQuery = ref('')
  const sortBy = ref<PharmacySort>('name')
  const inStockOnly = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const cities = computed<readonly TaiwanCity[]>(() => taiwanData as TaiwanCity[])

  const currentAreas = computed(() => {
    const city = cities.value.find((c) => c.CityName === selectedCity.value)
    return city?.AreaList ?? []
  })

  const filteredPharmacies = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    const pharmacies = features.value.filter((f) => {
      const inSelectedArea = !selectedArea.value
        ? f.properties.county === selectedCity.value
        : f.properties.county === selectedCity.value &&
          f.properties.town === selectedArea.value

      if (!inSelectedArea) return false

      if (inStockOnly.value && f.properties.mask_adult <= 0 && f.properties.mask_child <= 0) {
        return false
      }

      if (!query) return true

      const { name, address } = f.properties
      return (
        name.toLowerCase().includes(query) ||
        address.toLowerCase().includes(query)
      )
    })

    return [...pharmacies].sort((a, b) => {
      switch (sortBy.value) {
        case 'adult':
          return b.properties.mask_adult - a.properties.mask_adult
        case 'child':
          return b.properties.mask_child - a.properties.mask_child
        default:
          return a.properties.name.localeCompare(b.properties.name, 'zh-Hant')
      }
    })
  })

  const selectedPharmacy = computed(() =>
    selectedPharmacyId.value
      ? features.value.find((f) => f.properties.id === selectedPharmacyId.value) ?? null
      : null,
  )

  async function fetchPharmacies(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      if (!PHARMACY_API_URL) {
        throw new Error('缺少 VITE_PHARMACY_API_URL 設定')
      }
      const data = await ofetch<PharmacyGeoJSON>(PHARMACY_API_URL)
      if (!Array.isArray(data?.features)) {
        throw new Error('藥局資料格式不正確')
      }
      features.value = data.features.map(sanitizeFeature)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '資料載入失敗'
    } finally {
      isLoading.value = false
    }
  }

  function findNearest(lat: number, lng: number): PharmacyFeature | null {
    if (features.value.length === 0) return null
    let nearest: PharmacyFeature | null = null
    let minDist = Infinity
    for (const f of features.value) {
      const [fLng, fLat] = f.geometry.coordinates
      const d = haversineDistance(lat, lng, fLat, fLng)
      if (d < minDist) {
        minDist = d
        nearest = f
      }
    }
    return nearest
  }

  function setSelectedPharmacy(pharmacy: PharmacyFeature | null): void {
    selectedPharmacyId.value = pharmacy?.properties.id ?? null
  }

  return {
    features,
    selectedCity,
    selectedArea,
    selectedPharmacyId,
    searchQuery,
    sortBy,
    inStockOnly,
    isLoading,
    error,
    cities,
    currentAreas,
    filteredPharmacies,
    selectedPharmacy,
    fetchPharmacies,
    findNearest,
    setSelectedPharmacy,
  }
})
