<script setup lang="ts">

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import L, { Map } from 'leaflet'
import { MarkerClusterGroup } from 'leaflet.markercluster'
import { useRouter } from 'vue-router'

import { useIncidentsStore } from '@/stores/incidents.store'

const router = useRouter()

const mapWrapper = ref<HTMLElement | null>(null)
const map = ref<Map | null>(null)
const mapPip = ref<Map | null>(null)
const pipVisible = ref(false)
const mapWidth = ref(0)
const mapHeight = ref(0)
const destZoom = ref(7)
const marker = ref<any>(null)
const destPos = ref({
  lat: 50.0499,
  lng: 10.9876,
})
const int = ref<any>(null)
const markers = ref<MarkerClusterGroup>(new MarkerClusterGroup({
  disableClusteringAtZoom: 16,
  averageCenter: true,
}))
const markersPip = ref<MarkerClusterGroup>(new MarkerClusterGroup({
  disableClusteringAtZoom: 16,
  averageCenter: true,
}))
const pulsars = ref<MarkerClusterGroup>(new MarkerClusterGroup({
  disableClusteringAtZoom: 16,
  averageCenter: true,
}))
const { incidents } = storeToRefs(useIncidentsStore())
const pulsarMarkers = ref<any[]>([])
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
  const minLat = markersLatLngs.find((marker) => {
    return marker.lat === Math.min(...markersLatLngs.map((marker) => marker.lat))
  })
  const maxLat = markersLatLngs.find((marker) => {
    return marker.lat === Math.max(...markersLatLngs.map((marker) => marker.lat))
  })
  const minLng = markersLatLngs.find((marker) => {
    return marker.lng === Math.min(...markersLatLngs.map((marker) => marker.lng))
  })
  const maxLng = markersLatLngs.find((marker) => {
    return marker.lng === Math.max(...markersLatLngs.map((marker) => marker.lng))
  })
  const borders = [
    minLat,
    maxLat,
    minLng, 
    maxLng,
  ]
  const num = borders.length
  const sum = borders.reduce((prev, curr) => {
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
      zoomAnimation: false,
      maxZoom: 17,
    })
    .setView(geomCenter.value, 7)

  mapPip.value = L.map('mapPip', {
      zoomAnimation: false,
      maxZoom: 17,
    })
    .setView(geomCenter.value, 14)
  mapPip.value.addLayer(markers.value)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '',
  }).addTo(mapPip.value)
  setTimeout(function () {
    pipVisible.value = false
  }, 100);

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
    markersPip.value.addLayer(L.marker(markerLatLng))
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
  map.value.on('moveend', () => {
    if (!pulsarMarkers.value.length || !map.value) {
      return
    }
    const marker = pulsarMarkers.value[0]
    if (
      map.value.getBounds().contains(marker.getLatLng()) &&
      map.value.getZoom() === 14
    ) {
      // removePulsar(marker)
      pipVisible.value = false
    }
    setTimeout(() => {
      markers.value.bringToFront()
    }, 100)
  })

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '',
  }).addTo(map.value)

  map.value.addLayer(markers.value)
  map.value.addLayer(pulsars.value)
  mapPip.value.addLayer(markersPip.value)
}

function addPulsar(lat, lng) {
  if (!map.value) {
    return
  }
  const marker = L.marker([lat + 0.0001, lng], {
    icon: L.divIcon({
      className: 'pulsing-dot',
      iconSize: [200, 200],
    }),
  })
  pulsars.value.addLayer(marker)
  pulsarMarkers.value.push(marker)
  setTimeout(() => {
    markers.value.bringToFront()
  }, 100)
  pipVisible.value = false

  if (
    !map.value.getBounds().contains(marker.getLatLng()) ||
    map.value.getZoom() !== 14
  ) {
    if (mapPip.value) {
      mapPip.value.setView([lat, lng], 14)
    }
    pipVisible.value = true
  }
  return marker
}

function zoomToCurrentLocation() {
  if (!map.value || !pulsarMarkers.value.length) {
    return
  }

  const item = pulsarMarkers.value[0]
  map.value.setView(item.getLatLng(), 14)
  // removePulsar(item)
  pipVisible.value = false
  setTimeout(() => {
    markers.value.bringToFront()
  }, 300)
}

function removePulsar(item) {
  pulsarMarkers.value.splice(pulsarMarkers.value.indexOf(item), 1)
  pulsars.value.removeLayer(item)
}

watch(() => incidents, () => {
  const itemIndex = Math.floor(markersLatLngs.length * Math.random())
  const latlng = markersLatLngs[itemIndex]

  if (pulsarMarkers.value.length > 0) {
    removePulsar(pulsarMarkers.value[0])
  }

  marker.value = addPulsar(latlng.lat, latlng.lng)
  clearInterval(int.value)
  int.value = setInterval(clearMarkers, 26 * 1000)
}, { deep: true })

function clearMarkers() {
  if (pulsarMarkers.value.length > 0) {
    removePulsar(pulsarMarkers.value[0])
  }
  pipVisible.value = false
}

onMounted(() => {
  if (!mapWrapper.value) {
    return
  }

  new ResizeObserver(onResize).observe(mapWrapper.value)
  onResize()

  setTimeout(() => {
    initMap()
  }, 300)

  int.value = setInterval(clearMarkers, 26 * 1000)
})

onUnmounted(() => {
  clearInterval(int.value)
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
  <div
    class="map-pip-real"
    :class="pipVisible ? 'block' : 'invisible'"
  >
    <div id="mapPip">
    </div>
  </div>
  <div
    class="map-pip-real-attention"
    :class="pipVisible ? 'block' : 'invisible'"
  >
    <div class="map-pip-real-attention-text">
      New incident at this location
    </div>
    <div class="pulsing-dot-wrapper">
      <div class="pulsing-dot"></div>
    </div>
  </div>
  <div
    class="map-pip-real-overlay"
    :class="pipVisible ? 'block' : 'invisible'"
    @click="zoomToCurrentLocation"
  >
    Click to zoom to location
  </div>
</div>
</template>

<style lang="scss" scoped>
#map {
  height: 100%;
  width: 100%;
}

#mapPip {
  background-color: #fff;
  border: 1px solid hsl(var(--border));
  box-shadow: 2px 2px 8px hsla(var(--shadow));
  display: block;
  position: absolute;
  width: 300px;
  height: 300px;
  z-index: 401;
}

.map-page {
  position: relative;
  min-height: 100%;
}

.map-real {
  position: absolute;
  top: 0;
}

.map-pip-real {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 300px;
  height: 300px;
}

.map-pip-real-attention {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 300px;
  height: 300px;
  z-index: 501;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 2px 2px 4px hsla(var(--shadow));
}

.map-pip-real-attention-text {
  position: absolute;
  display: flex;
  background-color: hsl(var(--destructive));
  width: 300px;
  height: 40px;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
}

.pulsing-dot-wrapper {
  position: absolute;
  top: 50px;
  left: 50px;
}

.map-pip-real-overlay {
  background-color: rgba(0, 0, 0, .5);
  position: absolute;
  right: 10px;
  top: 10px;
  width: 300px;
  height: 300px;
  opacity: 0;
  z-index: 502;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
}

.invisible {
  visibility: hidden;
  pointer-events: none;
}

</style>