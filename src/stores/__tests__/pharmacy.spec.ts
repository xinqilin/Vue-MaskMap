import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePharmacyStore } from '@/stores/pharmacy'
import type { PharmacyFeature, PharmacyProperties } from '@/types'

vi.mock('@/config', () => ({ PHARMACY_API_URL: 'https://example.test/points.json' }))

// raw.githubusercontent.com serves JSON as text/plain; mirror that here.
function respondWith(body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify(body), {
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })),
  )
}

function feature(
  props: Partial<PharmacyProperties>,
  coordinates: [number, number] = [121.55, 25.03],
): PharmacyFeature {
  return {
    type: 'Feature',
    properties: {
      id: '1',
      name: '藥局',
      phone: '',
      address: '',
      mask_adult: 0,
      mask_child: 0,
      updated: '',
      available: '',
      note: '',
      custom_note: '',
      website: '',
      county: '臺北市',
      town: '大安區',
      cunli: '',
      service_periods: '',
      ...props,
    },
    geometry: { type: 'Point', coordinates },
  }
}

async function loadStore(features: PharmacyFeature[]) {
  respondWith({ type: 'FeatureCollection', features })
  const store = usePharmacyStore()
  await store.fetchPharmacies()
  return store
}

const ids = (features: readonly PharmacyFeature[]) => features.map((f) => f.properties.id)

describe('usePharmacyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('strips HTML tags and coerces invalid counts when loading', async () => {
    const store = await loadStore([
      feature({ name: '<b>好</b>藥局', mask_adult: -5, mask_child: Number.NaN }),
    ])

    const p = store.features[0].properties
    expect(p.name).toBe('好藥局')
    expect(p.mask_adult).toBe(0)
    expect(p.mask_child).toBe(0)
    expect(store.error).toBeNull()
  })

  it('reports an error when the payload has no features array', async () => {
    respondWith({})
    const store = usePharmacyStore()
    await store.fetchPharmacies()

    expect(store.error).toBe('藥局資料格式不正確')
    expect(store.isLoading).toBe(false)
  })

  it('filters by area, stock and keyword, then sorts', async () => {
    const store = await loadStore([
      feature({ id: 'a', name: '甲藥局', address: '和平東路', mask_adult: 5 }),
      feature({ id: 'b', name: '乙藥局', address: '復興南路', mask_adult: 9 }),
      feature({ id: 'c', name: '丙藥局', address: '和平東路' }),
      feature({ id: 'd', name: '丁藥局', town: '信義區', mask_adult: 50 }),
    ])

    store.sortBy = 'adult'
    expect(ids(store.filteredPharmacies)).toEqual(['b', 'a', 'c'])

    store.inStockOnly = true
    expect(ids(store.filteredPharmacies)).toEqual(['b', 'a'])

    store.searchQuery = '和平'
    expect(ids(store.filteredPharmacies)).toEqual(['a'])
  })

  it('finds the nearest pharmacy from GeoJSON [lng, lat] coordinates', async () => {
    const store = await loadStore([
      feature({ id: 'far' }, [121.0, 24.0]),
      feature({ id: 'near' }, [121.55, 25.03]),
    ])

    expect(store.findNearest(25.031, 121.551)?.properties.id).toBe('near')
  })
})
