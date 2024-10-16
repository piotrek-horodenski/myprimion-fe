<script setup lang="ts">

import { ref, computed, onMounted } from 'vue'
import L, {
  Map,
  Marker,
  TileLayer,
  LatLng,
  LayerGroup,
  Popup,
  PopupOptions,
} from 'leaflet'
import { MarkerClusterGroup } from 'leaflet.markercluster'
import { useRouter } from 'vue-router'

const router = useRouter()

const mapWrapper = ref<HTMLElement | null>(null)
const map = ref<Map | null>(null)
const mapWidth = ref(0)
const mapHeight = ref(0)
const destZoom = ref(7)
const destPos = ref({
  lat: 50.0499,
  lng: 10.9876,
})
const markers = ref<MarkerClusterGroup>(new MarkerClusterGroup({
  disableClusteringAtZoom: 16,
  averageCenter: true,
}))
const markersLatLngs = [
  {
    lat: 50.0499,
    lng: 10.9876,
  },
  {
    lat: 50.0599,
    lng: 10.9876,
  },
  {
    lat: 50.0499,
    lng: 10.9806,
  },
  {
    lat: 52.0499,
    lng: 13.9806,
  },
  {
    lat: 53.0499,
    lng: 9.9806,
  },
  {
    lat: 50.0499,
    lng: 14.4806,
  },
  {
    lat: 50.0499,
    lng: 11.9806,
  },
]

const geomCenter = computed(() => {
  const num = markersLatLngs.length
  const sum = markersLatLngs.reduce((prev, curr) => {
    return {
      lat: prev.lat + curr.lat,
      lng: prev.lng + curr.lng,
    }
  })

  return {
    lat: sum.lat / num,
    lng: sum.lng / num,
  }
})

const mapStyles = computed(() => {
  const width = !mapWidth.value ? '100%' : mapWidth.value + 'px'
  const height = !mapHeight.value ? '99vh' : mapHeight.value + 'px'

  return {
    width,
    height,
  }
})

function onResize() {
  if (!mapWrapper.value) {
    return
  }
  
  const rect = mapWrapper.value.getBoundingClientRect()

  mapWidth.value = rect.width
  mapHeight.value = rect.height

  setTimeout(() => {
    if (map.value) {
      map.value.invalidateSize()
    }
  })
}

function markerPopupClick() {
  router.push({
    name: 'home',
  })
}

function markerZoomInClick($event) {
  if (!map.value) {
    return
  }

  const index = $event.target.attributes['data-index'].value

  destZoom.value = 17
  destPos.value = markersLatLngs[index]
  map.value.setView(destPos.value, destZoom.value)
}

function initMap() {
  const buttonId1 = 'btnShow1'
  const buttonId2 = 'btnShow2'

  map.value = L.map('map', {
    zoomAnimation:false,
  })
    .setView(geomCenter.value, 7)

  markersLatLngs.forEach((markerLatLng, index) => {
    const marker = L.marker(markerLatLng)
    marker.bindPopup(`
      <div><strong>Location ${index + 1}</strong></div>
      <div class="mt-2">Click here to show floors in <strong>Location ${index + 1}</strong></div>
      <div class="mt-2"><button
        id="${buttonId1}_${index}"
        data-index="${index}"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 py-0 px-3"
      >show</button><button
        id="${buttonId2}_${index}"
        data-index="${index}"
        class="ml-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 py-0 px-3"
      >zoom in</button></div>
    `)
    markers.value.addLayer(marker)
  })
  map.value.on('popupopen', () => {
    markersLatLngs.forEach((markerLatLng, index) => {
      const btn1 = document.querySelector('#' + buttonId1 + '_' + index)
      const btn2 = document.querySelector('#' + buttonId2 + '_' + index)
      
      if (btn1) {
        btn1.addEventListener('click', markerPopupClick)
      }
      if (btn2) {
        btn2.addEventListener('click', markerZoomInClick)
      }
    })
  })
  map.value.on('popupclose', () => {
    markersLatLngs.forEach((markerLatLng, index) => {
      const btn1 = document.querySelector('#' + buttonId1 + '_' + index)
      const btn2 = document.querySelector('#' + buttonId2 + '_' + index)

      if (btn1) {
        btn1.removeEventListener('click', markerPopupClick)
      }
      if (btn2) {
        btn2.removeEventListener('click', markerZoomInClick)
      }
    })
  })



  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '',
  }).addTo(map.value)

  map.value.addLayer(markers.value)

  // L.marker([50.0499, 10.9876]).addTo(map.value)
  //   .bindPopup(`
  //     <div><strong>Location 1</strong></div>
  //     <div class="mt-2">Click here to show floors in <strong>Location 1</strong></div>
  //     <div class="mt-2"><button
  //       id="${buttonId1}"
  //       class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 py-0 px-3"
  //     >show</button><button
  //       id="${buttonId2}"
  //       class="ml-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 py-0 px-3"
  //     >zoom in</button></div>
  //   `)
  // map.value.on('popupopen', () => {
  //   document.querySelector('#' + buttonId1).addEventListener('click', markerPopupClick)
  //   document.querySelector('#' + buttonId2).addEventListener('click', markerZoomInClick)
  // })
  // map.value.on('popupclose', () => {
  //   document.querySelector('#' + buttonId1).removeEventListener('click', markerPopupClick)
  //   document.querySelector('#' + buttonId2).removeEventListener('click', markerZoomInClick)
  // })
}

onMounted(() => {
  if (!mapWrapper.value) {
    return
  }

  new ResizeObserver(onResize).observe(mapWrapper.value)
  onResize()

  setTimeout(initMap, 300)
})

</script>
<template>
<div
  class="map-page"
  ref="mapWrapper"
>
  <div class="map-real">
    <div
      id="map"
      :style="mapStyles"
    >
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
#map {
  height: 100%;
  width: 100%;
}

.map-page {
  position: relative;
  min-height: 100%;
}

.map-real {
  position: absolute;
  top: 0;
}
</style>