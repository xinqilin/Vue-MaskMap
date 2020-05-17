# maskMap-vue.js
---------------------------------
`vue --version 看版本`
若無，則  npm install -g @vue/cli 建立
`vue update -g @vue/cli ` 更新 vue-cli 版本

### 開始
`vue create name`

選手動 > 多選一個scss

## 加套件
# bootstrap
`npm install pluginsName`

# 引用
根目錄為node_modules
===> 
```js
@import 'bootstrap/.....';  
```
# 資料JSON


## 遠端資料
#### API 路徑：

`https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json`
#### 台灣縣市 JSON: 
`https://github.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON`

## 藥局JSON
`EX:`
```json
{
    type: "Feature",
    properties: {
        id: "5945010154",
        name: "郭藥局",
        phone: "03-8230761",
        address: "花蓮縣花蓮市中美路９５號之３",
        mask_adult: 3667,
        mask_child: 1107,
        updated: "2020/05/17 15:47:40",
        available: "星期一上午看診、星期二上午看診、星期三上午看診、星期四上午看診、星期五上午看診、星期六上午休診、星期日上午休診、星期一下午看診、星期二下午看診、星期三下午看診、星期四下午看診、星期五下午看診、星期六下午看診、星期日下午看診、星期一晚上看診、星期二晚上看診、星期三晚上看診、星期四晚上看診、星期五晚上看診、星期六晚上看診、星期日晚上看診",
        note: "服務時段：上午10-12、下午2:30-4:30、晚上7-8:30",
        custom_note: "",
        website: "",
        county: "花蓮縣",
        town: "花蓮市",
        cunli: "民勤里",
        service_periods: "NNNNNYYNNNNNNNNNNNNNN"
    },
    geometry: {
        type: "Point",
        coordinates: [
        121.624669,
        23.990268
        ]
    }
},
```

## 加套件2 - vue axios
`API: https://www.npmjs.com/package/vue-axios`

`npm install --save axios vue-axios`
>進入點 (main.js) 引入
```js
import axios from 'axios';
import VueAxios from 'vue-axios';
```

*注意: axios屬外部套件 外部套件要放在內部套件前
內部套件(自己寫的) 往後放，
放完後要引用剛剛import的東西

```js 
Vue.use(VueAxios, axios);
```

引用完後，有三種寫法:
```js
    Vue.axios.get(api).then((response) => {
  console.log(response.data)
})
 
    this.axios.get(api).then((response) => {
  console.log(response.data)
})
 
    this.$http.get(api).then((response) => {
  console.log(response.data)
})
```


