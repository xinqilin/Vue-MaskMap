import { describe, expect, it } from 'vitest'
import { buildPopup } from '@/composables/useMap'
import type { PharmacyProperties } from '@/types'

const base: PharmacyProperties = {
  id: '1',
  name: '藥局',
  phone: '02-1234-5678',
  address: '臺北市大安區',
  mask_adult: 1,
  mask_child: 2,
  updated: '2026-10-09',
  available: '',
  note: '',
  custom_note: '',
  website: '',
  county: '臺北市',
  town: '大安區',
  cunli: '',
  service_periods: '',
}

describe('buildPopup', () => {
  it('renders data fields as text, never as markup', () => {
    // An unclosed tag survives the store's tag-stripping regex.
    const payload = '<img src=x onerror=alert(1)//'
    const html = buildPopup({ ...base, name: payload, address: payload, phone: payload, updated: payload })
    const doc = new DOMParser().parseFromString(html, 'text/html')

    expect(doc.querySelector('img')).toBeNull()
    expect(doc.body.textContent).toContain(payload)
  })
})
