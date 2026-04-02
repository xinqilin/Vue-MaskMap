export const MAP_CONFIG = Object.freeze({
  defaultCenter: [25.03, 121.55] as [number, number],
  defaultZoom: 15,
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  tileAttribution:
    '<a target="_blank" href="https://www.openstreetmap.org/">© OpenStreetMap 貢獻者</a>',
  maxZoom: 18,
})

export const MARKER_ICONS = Object.freeze({
  green: '/markers/marker-icon-green.png',
  grey: '/markers/marker-icon-grey.png',
  shadow: '/markers/marker-shadow.png',
})

export const PHARMACY_API_URL = import.meta.env.VITE_PHARMACY_API_URL
