import { shallowRef, onUnmounted } from 'vue'
import L from 'leaflet'
import type { PharmacyFeature, PharmacyProperties } from '@/types'
import { MAP_CONFIG, MARKER_ICONS } from '@/config'

const iconConfig = {
  iconSize: [25, 41] as L.PointExpression,
  iconAnchor: [12, 41] as L.PointExpression,
  popupAnchor: [1, -34] as L.PointExpression,
  shadowUrl: MARKER_ICONS.shadow,
  shadowSize: [41, 41] as L.PointExpression,
}

const icons = {
  green: new L.Icon({ iconUrl: MARKER_ICONS.green, ...iconConfig }),
  grey: new L.Icon({ iconUrl: MARKER_ICONS.grey, ...iconConfig }),
}

function buildPopup(p: PharmacyProperties): string {
  const adult = Number.isFinite(p.mask_adult) ? `${p.mask_adult} 個` : '未取得資料'
  const child = Number.isFinite(p.mask_child) ? `${p.mask_child} 個` : '未取得資料'
  const mapsUrl = `https://www.google.com.tw/maps/place/${encodeURIComponent(p.address)}`
  return [
    `<strong>${p.name}</strong>`,
    `口罩剩餘：<strong>成人 ${adult} / 兒童 ${child}</strong>`,
    `地址：<a href="${mapsUrl}" target="_blank" rel="noopener noreferrer">${p.address}</a>`,
    `電話：${p.phone}`,
    `<small>最後更新：${p.updated}</small>`,
  ].join('<br>')
}

export function useMap() {
  const mapInstance = shallowRef<L.Map | null>(null)
  const markerGroup = shallowRef<L.LayerGroup | null>(null)
  const pharmacyMarkers = shallowRef<Map<string, L.Marker>>(new Map())
  const selectedMarkerHighlight = shallowRef<L.CircleMarker | null>(null)
  const userMarker = shallowRef<L.Marker | null>(null)

  function init(containerId: string): void {
    const map = L.map(containerId, {
      center: MAP_CONFIG.defaultCenter,
      zoom: MAP_CONFIG.defaultZoom,
    })
    L.tileLayer(MAP_CONFIG.tileUrl, {
      attribution: MAP_CONFIG.tileAttribution,
      maxZoom: MAP_CONFIG.maxZoom,
    }).addTo(map)
    const group = L.layerGroup().addTo(map)
    mapInstance.value = map
    markerGroup.value = group
  }

  function setMarkers(pharmacies: readonly PharmacyFeature[]): void {
    const group = markerGroup.value
    if (!group) return
    group.clearLayers()
    selectedMarkerHighlight.value?.remove()
    pharmacyMarkers.value = new Map()
    for (const pharmacy of pharmacies) {
      const { properties: p, geometry: g } = pharmacy
      const icon = p.mask_adult || p.mask_child ? icons.green : icons.grey
      const marker = L.marker([g.coordinates[1], g.coordinates[0]], { icon })
        .bindPopup(buildPopup(p))
        .addTo(group)
      pharmacyMarkers.value.set(p.id, marker)
    }
    selectedMarkerHighlight.value = null
  }

  function focusMarker(pharmacy: PharmacyFeature): void {
    const map = mapInstance.value
    if (!map) return
    const { properties: p, geometry: g } = pharmacy
    const latlng: L.LatLngTuple = [g.coordinates[1], g.coordinates[0]]
    selectedMarkerHighlight.value?.remove()
    selectedMarkerHighlight.value = L.circleMarker(latlng, {
      radius: 18,
      color: '#1d4ed8',
      weight: 2,
      fillColor: '#93c5fd',
      fillOpacity: 0.18,
      interactive: false,
    }).addTo(map)
    const marker = pharmacyMarkers.value.get(p.id)
    marker?.openPopup()
  }

  function panTo(pharmacy: PharmacyFeature): void {
    const map = mapInstance.value
    if (!map) return
    const { geometry: g } = pharmacy
    const latlng: L.LatLngTuple = [g.coordinates[1], g.coordinates[0]]
    map.panTo(latlng)
    focusMarker(pharmacy)
  }

  function showUserLocation(lat: number, lng: number): void {
    const map = mapInstance.value
    if (!map) return
    userMarker.value?.remove()
    const marker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: '',
        html: '<div style="width:16px;height:16px;background:#3b82f6;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.4)"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    })
      .addTo(map)
      .bindPopup('你在這裡')
      .openPopup()
    userMarker.value = marker
    map.panTo([lat, lng])
  }

  onUnmounted(() => {
    mapInstance.value?.remove()
    mapInstance.value = null
    markerGroup.value = null
    pharmacyMarkers.value = new Map()
    selectedMarkerHighlight.value = null
    userMarker.value = null
  })

  return { init, setMarkers, panTo, focusMarker, showUserLocation }
}
