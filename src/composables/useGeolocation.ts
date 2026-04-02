import { ref } from 'vue'

export function useGeolocation() {
  const isLocating = ref(false)
  const locationError = ref<string | null>(null)

  function locate(): Promise<GeolocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = new Error('此裝置不支援地理定位')
        locationError.value = err.message
        reject(err)
        return
      }
      isLocating.value = true
      locationError.value = null
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          isLocating.value = false
          resolve(pos.coords)
        },
        (err) => {
          isLocating.value = false
          locationError.value = '無法取得位置，請確認已授權定位權限'
          reject(err)
        },
        { timeout: 10000, enableHighAccuracy: true },
      )
    })
  }

  return { isLocating, locationError, locate }
}
