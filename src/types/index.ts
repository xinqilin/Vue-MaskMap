export interface PharmacyProperties {
  readonly id: string
  readonly name: string
  readonly phone: string
  readonly address: string
  readonly mask_adult: number
  readonly mask_child: number
  readonly updated: string
  readonly available: string
  readonly note: string
  readonly custom_note: string
  readonly website: string
  readonly county: string
  readonly town: string
  readonly cunli: string
  readonly service_periods: string
}

export type Coordinates = readonly [longitude: number, latitude: number]

export interface PharmacyFeature {
  readonly type: 'Feature'
  readonly properties: PharmacyProperties
  readonly geometry: {
    readonly type: 'Point'
    readonly coordinates: Coordinates
  }
}

export interface PharmacyGeoJSON {
  readonly type: 'FeatureCollection'
  readonly features: readonly PharmacyFeature[]
}

export type PharmacySort = 'name' | 'adult' | 'child'

export interface TaiwanArea {
  readonly ZipCode: string
  readonly AreaName: string
  readonly AreaEngName: string
}

export interface TaiwanCity {
  readonly CityName: string
  readonly CityEngName: string
  readonly AreaList: readonly TaiwanArea[]
}
