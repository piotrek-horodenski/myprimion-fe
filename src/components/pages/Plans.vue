<script setup lang="ts">

import { onMounted, ref, computed } from 'vue'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

const wrapper = ref<HTMLElement | null>(null)

const width = ref(150)
const height = ref(150)

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

const tooltipContent1 = `
<div class="flex flex-row">
  <div class="grow-0">
    <em class="material-symbols-outlined cursor-pointer">thermometer</em>
  </div>
  <div class="grow-1">
    <div>Temperature: <strong>20°C</strong></div>
    <div>Temperature trend: rising</div>
    <div>Humidity: <strong>60%</strong></div>
  </div>
</div>
`

const tooltipContent2 = `
<div class="flex flex-row">
  <div class="grow-0">
    <em class="material-symbols-outlined cursor-pointer">door_open</em>
  </div>
  <div class="grow-1">
    <div>State: <strong>Open</strong></div>
    <div>Last update: 1 hour ago</div>
  </div>
</div>
`

</script>
<template>
  <div
    class="flex flex-col items-center justify-center relative"
    ref="wrapper"
    :style="styles"
  >
    <img
      src="/floor-plan.png"
      class="shrink-1 grow-0"
      alt="floor"
    />
    <div class="floating">
      <Popover>
        <PopoverTrigger as-child>
          <Button
            variant="destructive"
            style="top: -80px; left: -80px"
            v-tooltip="{
              content: tooltipContent1,
              html: true,
            }"
          >
            <em class="material-symbols-outlined cursor-pointer">thermometer</em>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-50 text-center">
          <div class="mb-4">
            <Button @click="$router.push({ name: 'home' })">Go to dashboard</Button>
          </div>
          <div class="mb-4">
            <Button @click="$router.push({ name: 'process' })">Go to process</Button>
          </div>
          <div class="mb-4">
            <Button @click="$router.push({ name: 'events' })">Go to events</Button>
          </div>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger as-child>
          <Button
            variant="default"
            style="top: 30px"
            v-tooltip="{
              content: tooltipContent2,
              html: true,
            }"
          >
            <em class="material-symbols-outlined cursor-pointer">door_open</em>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-50 text-center">
          <div class="mb-4">
            <Button @click="$router.push({ name: 'home' })">Go to dashboard</Button>
          </div>
          <div class="mb-4">
            <Button @click="$router.push({ name: 'process' })">Go to process</Button>
          </div>
          <div class="mb-4">
            <Button @click="$router.push({ name: 'events' })">Go to events</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </div>
</template>
<style scoped>

img {
  width: 80%;
  max-width: 650px;
}

.floating {
  position: absolute;
}

.floating > button {
  position: absolute;
}

</style>