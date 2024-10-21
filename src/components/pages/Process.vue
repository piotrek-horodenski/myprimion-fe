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
    if (!wrapper.value) {
      return
    }
    width.value = wrapper.value.parentNode!.offsetWidth
    height.value = wrapper.value.parentNode!.offsetHeight
  }

  resize()
  const observer = new ResizeObserver(resize)
  observer.observe(wrapper.value!.parentNode)
})

</script>
<template>
<div
  class="flex flex-col items-center justify-center"
  ref="wrapper"
>
  <iframe
    src="http://192.168.162.235:18081/processes?process=demo&version=1&active=true&incidents=true&completed=true&canceled=true"
    
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