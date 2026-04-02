# 台灣藥局口罩地圖

互動式地圖顯示台灣各藥局口罩庫存。以 Vue 3 現代技術棧重構的練習專案。

> **注意**：口罩實名制已結束。資料來源 [kiang/pharmacies](https://github.com/kiang/pharmacies) 僅供展示用途，數值不代表實際庫存。

## 專案定位

這個專案是我用來練習 Vue 3、Vite 8、TypeScript 6、Pinia、Leaflet 的前端整合型練習作品。

目標不是做出商業產品，而是用一個真實資料來源，把以下幾件事串起來：

- 現代 Vue 3 Composition API 開發方式
- Vite 8 + TypeScript 6 升版後的專案結構整理
- Pinia store 狀態拆分與查詢條件管理
- Leaflet 地圖整合、marker 管理與互動同步
- RWD 版型與 mobile / desktop 不同資訊架構

## Tech Stack

| 工具 | 版本 | 說明 |
|------|------|------|
| [Vite](https://vite.dev) | 8.x | 建構工具（Rolldown 引擎） |
| [Vue](https://vuejs.org) | 3.x | UI 框架（Composition API + `<script setup>`） |
| [TypeScript](https://www.typescriptlang.org) | 6.x | 型別系統（strict mode） |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | CSS 框架（CSS-first config） |
| [Pinia](https://pinia.vuejs.org) | 3.x | 狀態管理 |
| [Leaflet](https://leafletjs.com) | 1.9.x | 互動式地圖 |
| [ofetch](https://github.com/unjs/ofetch) | 1.x | HTTP 客戶端（取代 axios） |

## 畫面說明

### Desktop

- 左側為固定 sidebar，包含縣市 / 地區篩選、搜尋、排序、庫存條件與藥局列表
- 右側為 Leaflet 地圖，依目前篩選結果顯示藥局 markers
- 點擊列表項目後，地圖會自動移動到對應藥局並開啟 popup

### Mobile

- 主要畫面以地圖為主
- Header 提供「清單」按鈕，可叫出底部面板
- 底部面板整合篩選與列表，選取藥局後自動收合，回到地圖查看位置

### 地圖互動

- 綠色 marker 代表成人或兒童口罩仍有數量
- 灰色 marker 代表口罩數量為 0
- 目前選取的藥局會同步高亮
- 使用者可透過定位功能切換到最近藥局所在區域

## 已完成功能

- 縣市 / 區域篩選藥局清單
- 關鍵字搜尋藥局名稱或地址
- 排序功能（名稱 / 成人庫存 / 兒童庫存）
- 只看有庫存藥局
- 互動式地圖，口罩顏色標記（綠色 = 有庫存，灰色 = 無庫存）
- 點擊清單中的藥局，地圖自動 pan 到該位置並同步高亮
- 定位功能：「定位我的位置」按鈕 + 自動切換到最近藥局所在區域
- Loading 狀態與錯誤處理（含重試按鈕）
- RWD 響應式布局，手機版可開啟底部清單面板
- 基本資料清洗，避免 popup 直接吃進原始 HTML 內容
- 環境變數檢查與 API 格式基本防呆

## 當前架構重點

- `App.vue` 負責頁面排版、desktop / mobile sidebar 切換，以及 map 與 sidebar 的事件協調
- `stores/pharmacy.ts` 集中管理資料載入、篩選條件、排序條件、搜尋字串與目前選取藥局
- `composables/useMap.ts` 負責 Leaflet instance、marker group、選取高亮與使用者定位標記
- `components/` 只負責 UI 呈現與事件傳遞，避免把查詢邏輯散落在 template 裡

## 開始使用

```bash
# 安裝依賴
pnpm install

# 啟動 dev server (http://localhost:5173)
pnpm dev

# Production build
pnpm build

# 預覽 production build
pnpm preview

# Lint
pnpm lint

# Type check
pnpm type-check
```

## 環境變數

複製 `.env.example` 為 `.env`：

```env
VITE_PHARMACY_API_URL=https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json
```

## 架構

```
src/
├── main.ts                    # 進入點：createApp + createPinia
├── config.ts                  # 全域設定（地圖中心、API URL、icon 路徑）
├── App.vue                    # 根元件：組合 Header + Sidebar + Map
├── types/
│   └── index.ts               # TypeScript 介面：PharmacyFeature, TaiwanCity, PharmacySort
├── stores/
│   └── pharmacy.ts            # Pinia store：藥局資料、搜尋/篩選/排序、選取狀態
├── composables/
│   ├── useMap.ts              # Leaflet 地圖邏輯（markers 管理、選取高亮）
│   └── useGeolocation.ts      # 瀏覽器 Geolocation API
└── components/
    ├── AppHeader.vue          # 標題列 + 定位按鈕 + 手機版清單切換
    ├── PharmacySidebar.vue    # 側邊欄 / 手機版底部面板容器
    ├── CityDistrictFilter.vue # 縣市 / 地區 / 搜尋 / 排序 / 庫存條件
    ├── DataStatusBanner.vue   # Loading / 錯誤 / 過期提示
    ├── PharmacyList.vue       # 藥局列表（從 store 取 filteredPharmacies + selectedPharmacyId）
    ├── PharmacyCard.vue       # 單一藥局卡片（支援 selected state）
    └── PharmacyMap.vue        # Leaflet 地圖（expose panTo, locateUser）
```

## 升版後目前驗證狀態

- `pnpm lint`
- `pnpm type-check`
- `pnpm build`

目前上述檢查皆可通過，代表 Vue 3 + Vite 8 + TypeScript 6 的基本建置鏈已經穩定。

## Roadmap

### Phase 1: 查詢體驗完善

- [x] 手機版底部清單面板
- [x] 搜尋藥局名稱或地址
- [x] 排序功能
- [x] 只看有庫存
- [x] 列表與地圖選取同步
- [x] 修正重複建立 marker 的互動問題

### Phase 2: 資料層與穩定性

- [ ] 更完整的 runtime schema validation
- [ ] 加入資料快取與最後同步時間
- [ ] 針對 API 失敗提供 fallback 策略
- [ ] 將 query state 和 data state 做更清楚的切分
- [ ] 補上 store / composable 測試

### Phase 3: 作品集等級功能

- [ ] 收藏藥局並儲存在 localStorage
- [ ] 顯示與目前位置的距離
- [ ] 距離排序與最近藥局清單
- [ ] URL query sync，方便分享當前篩選狀態
- [ ] 區域統計摘要卡
- [ ] e2e 測試覆蓋 mobile、定位、搜尋、篩選流程

## Todo

### 近期優先

- [ ] 補測試基礎設施（Vitest + Vue Test Utils）
- [ ] 為 API response 建立明確 schema 驗證
- [ ] 補 `last updated` 顯示與資料快取
- [ ] README 加入實際畫面截圖

### 可選擴充

- [ ] 收藏清單頁籤
- [ ] 距離 badge
- [ ] 導航按鈕優化
- [ ] 依行政區統計藥局數量與庫存總量

## 安全性

| 問題 | 處置方式 |
|------|----------|
| axios CRITICAL CVEs (SSRF/DoS) | 改用 ofetch |
| Vue 2 EOL | 升級 Vue 3 |
| node-sass 廢棄 | 改用 Tailwind CSS v4 |
| Leaflet bindPopup XSS | store ingestion 時 strip HTML tags |
| cdn.rawgit.com 已關閉 | marker icons 本地化至 `/public/markers/` |
| npm taobao SHA-1 hashes | 全新 pnpm-lock.yaml（官方 registry） |

## 資料來源

- 藥局資料：[kiang/pharmacies](https://github.com/kiang/pharmacies)
- 台灣縣市區域 JSON：[donma/TaiwanAddressCityAreaRoadChineseEnglishJSON](https://github.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON)
- 地圖圖磚：[OpenStreetMap](https://www.openstreetmap.org/)
- Marker icons：[pointhi/leaflet-color-markers](https://github.com/pointhi/leaflet-color-markers)
