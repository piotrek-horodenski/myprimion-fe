<script setup lang="ts">

import {
  VisAxis,
  VisSingleContainer,
  VisTooltip,
  VisDonut,
  VisStackedBar,
  VisXYContainer,
  VisGroupedBar,
} from '@unovis/vue'
import { Donut } from '@unovis/ts'
import { ref, computed } from 'vue'
import { MinusIcon, PlusIcon } from '@radix-icons/vue'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

const goal = ref(6)

type Data = typeof data[number]
const ddata = computed(() => {
  const goals = [
    { goal: 200 },
    { goal: 100 },
    { goal: 150 },
    { goal: 200 },
    { goal: 240 },
    { goal: 278 },
    { goal: 189 },
    { goal: 239 },
    { goal: 90 },
    { goal: 40 },
    { goal: 378 },
    { goal: 589 },
    { goal: 949 },
    { goal: 1110 },
    { goal: 1300 },
    { goal: 1200 },
    { goal: 1278 },
    { goal: 1189 },
    { goal: 1239 },
    { goal: 1420 },
    { goal: 1200 },
    { goal: 1278 },
    { goal: 1189 },
    { goal: 2349 },
  ]

  return goals.slice(0, goal.value)
})

const data = [
  15,
  66,
  22,
  33,
  15,
  55,
]
const triggers = { [Donut.selectors.segment]: d => d.data }
const value = (d: number) => d

const data2 = [
  {
    x: 1,
    y: 55,
    y1: 33,
    y2: 22,
  },
  {
    x: 2,
    y: 33,
    y1: 22,
    y2: 15,
  },
  {
    x: 3,
    y: 22,
    y1: 15,
    y2: 66,
  },
  {
    x: 4,
    y: 15,
    y1: 66,
    y2: 55,
  },
]
const d2x = (d: DataRecord) => d.x
const d2y = [
    (d: DataRecord) => d.y,
    (d: DataRecord) => d.y1,
    (d: DataRecord) => d.y2
  ]

</script>
<template>
<div class="flex flex-row gap-8 justify-around">
  <VisSingleContainer :data="data">
    <VisTooltip :triggers="triggers" />
    <VisDonut :arcWidth="0" :value="value" />
  </VisSingleContainer>
  <VisXYContainer :data="data2">
    <VisGroupedBar :x="d2x" :y="d2y" />
    <VisAxis type="x" />
    <VisAxis type="y" />
  </VisXYContainer>
</div>
<div>
  <div class="flex flex-row gap-8 justify-around">
    <Drawer>
      <DrawerTrigger as-child>
        <Button variant="outline">
          Show more
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div class="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Change period</DrawerTitle>
            <DrawerDescription>Set number of months in the past</DrawerDescription>
          </DrawerHeader>
          <div class="p-4 pb-0">
            <div class="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                class="h-8 w-8 shrink-0 rounded-full"
                :disabled="goal <= 3"
                @click="goal -= 1"
              >
                <MinusIcon class="h-4 w-4" />
                <span class="sr-only">Decrease</span>
              </Button>
              <div class="flex-1 text-center">
                <div class="text-7xl font-bold tracking-tighter">
                  {{ goal }}
                </div>
                <div class="text-[0.70rem] uppercase text-muted-foreground">
                  Months in the past
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                class="h-8 w-8 shrink-0 rounded-full"
                :disabled="goal >= 24"
                @click="goal += 1"
              >
                <PlusIcon class="h-4 w-4" />
                <span class="sr-only">Increase</span>
              </Button>
            </div>
            <div class="my-3 px-3">
              <VisXYContainer
                :data="ddata"
                :width="320"
                class=""
                :style="{
                  'opacity': 0.9,
                  '--theme-primary': `hsl(var(--foreground))`,
                }"
              >
                <VisStackedBar
                  :x="(d: Data, i :number) => i"
                  :y="(d: Data) => d.goal"
                  color="var(--theme-primary)"
                  :bar-padding="0.1"
                  :rounded-corners="0"
                />
              </VisXYContainer>
            </div>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose as-child>
              <Button variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  </div>
</div>
</template>
<style scoped>
.unovis-single-container {
  max-width: calc(30% - 2rem);
}

.unovis-xy-container {
  max-width: calc(70% - 2rem);
}

</style>