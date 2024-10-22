<script setup lang="ts">

import { onMounted, ref, computed } from 'vue'

import { useSettingsStore } from "@/stores/settings.store"; // Importuj store
import { storeToRefs } from 'pinia'
const wrapper = ref<HTMLElement | null>(null)

const width = ref(150)
const height = ref(150)
const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)
const processUrl = ref(`${settings.value.incidents.processUrl}?process=demo&version=1&active=true&incidents=true&completed=true&canceled=true`)
const styles = computed(() => {
  return {
    width: `${width.value}px`,
    height: `${height.value}px`,
  }
})

onMounted(() => {

  function resize() {
    if (!wrapper.value || !wrapper.value.parentNode) {
      return
    }
    width.value = (wrapper.value.parentNode as HTMLElement).offsetWidth
    height.value = (wrapper.value.parentNode as HTMLElement).offsetHeight
  }

  resize()
  const observer = new ResizeObserver(resize)

  if (!wrapper.value || !wrapper.value.parentNode) {
    return
  }
  observer.observe(wrapper.value.parentNode as Element)
})

</script>
<template>
<div
  class="flex flex-col items-center justify-center"
  ref="wrapper"
>
  <iframe
      :src="processUrl"

      :style="styles"
  >
  </iframe>
</div>
</template>
<style scoped>

.flex {
  height: calc(99.999vh - 170px);
}

iframe {
  width: 92%;
  max-width: 100%;
  height: calc(100vh - 170px);
  width: 100%;
}

</style>