<template>
  <div id="app">
    <div class="row no-gutters">
      <div class="col-sm-3">
        <div class="toolbox">
          <div class="sticky-top bg-white shadow-sm p-2">
            <div class="form-group d-flex">
              <label for="cityName" class="mr-2 col-form-label text-right">縣市</label>
              <div class="flex-fill">
                <select id="cityName" class="form-control" v-model="select.checkCity">
                  <option value="">-- Select One --</option>
                  <option v-for="c in Taiwan" :key="c.CityName" :value="c.CityName">
                    {{c.CityName}}</option>
                </select>
              </div>
            </div>
            <div class="form-group d-flex">
              <label for="area" class="mr-2 col-form-label text-right">地區</label>
              <div class="flex-fill">
                <select id="area" class="form-control">
                  <option value="">-- Select One --</option>
                </select>
              </div>
            </div>
            <p class="mb-0 small text-muted text-right">請先選擇區域查看（綠色表示還有口罩）</p>
          </div>
          <ul class="list-group">
            <template>
              <a class="list-group-item text-left">
                <h3>藥局名稱</h3>
                <p class="mb-0">
                  成人口罩：1 | 兒童口罩：2
                </p>
                <p class="mb-0">
                  地址：
                  <a
                    href="https://www.google.com.tw/maps/place/..."
                    target="_blank"
                    title="Google Map"
                  >
                    地址
                  </a>
                </p>
              </a>
            </template>
          </ul>
        </div>
      </div>
      <div class="col-sm-9">
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>


<style lang="scss">
@import "bootstrap/scss/bootstrap.scss";
#map {
  height: 100vh;
}
.highlight {
  background: #e9ffe3;
}
.toolbox {
  height: 100vh;
  overflow-y: auto;
  a {
    cursor: pointer;
  }
}
</style>

<script>
import L from 'leaflet';
import Taiwan from './assets/Taiwan.json';

let osmMap = {};

console.log(L);

export default {
  name: 'App',
  data: () => ({
    medicineData: [],
    Taiwan,
    select: {
      checkCity: '臺北市',
    },
  }),
  components: {

  },
  methods: {
    updateMap() {
      const pharmacies = this.medicineData.filter((pharmacy) => (
        pharmacy.properties.county === this.select.checkCity));

      pharmacies.forEach((pharmacy) => {
        L.marker([
          pharmacy.geometry.coordinates[1],
          pharmacy.geometry.coordinates[0],
        ]).addTo(osmMap);
      });
    },
  },
  mounted() {
    const url = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json';
    this.axios.get(url).then((response) => {
      console.log(response);
      this.medicineData = response.data.features;
      this.updateMap();
    });


    osmMap = L.map('map', {
      center: [25.03, 121.55],
      zoom: 15,
    });


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    }).addTo(osmMap);

    // L.marker().addTo(osmMap);
  },

};
</script>
