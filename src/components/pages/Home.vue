<script setup lang="ts">
import { h, onMounted } from 'vue'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import Plans from '@/components/pages/Plans.vue'
import Process from '@/components/pages/Process.vue'
import EventsTable from '@/components/pages/EventsTable.vue'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ref } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { ToastAction } from '@/components/ui/toast'

const { toast } = useToast()

const selectedFloor = ref(0)
const selectedItem = ref(0)

onMounted(() => {
  setTimeout(() => {
    toast({
      title: 'Uh oh! Something went wrong.',
      description: 'There was a problem with your request.',
      variant: 'destructive',
      action: h(ToastAction, {
        altText: 'Try again',
      }, {
        default: () => 'Try again',
      }),
    })
  }, 3000)
})

</script>

<template>
<ResizablePanelGroup
  id="demo-group-all"
  direction="vertical"
  class="panel rounded-lg border"
>
  <ResizablePanel id="demo-panel-5" :default-size="45">
    <ResizablePanelGroup
      id="demo-group-1"
      direction="horizontal"
      class="panel rounded-lg border"
    >
      <ResizablePanel id="demo-panel-1" :default-size="10">
        <div class="flex flex-col h-full p-4 gap-4 cursor-pointer">
          <div>
            <Badge
              :variant="selectedFloor === 0 ? null : 'secondary'"
              @click="selectedFloor = 0"
            >Servers A</Badge>
          </div>
          <div>
            <Badge
              :variant="selectedFloor === 1 ? null : 'secondary'"
              @click="selectedFloor = 1"
            >Servers B</Badge>
          </div>
          <div>
            <Badge
              :variant="selectedFloor === 2 ? null : 'secondary'"
              @click="selectedFloor = 2"
            >Servers C</Badge>
          </div>
          <div>
            <Badge
              :variant="selectedFloor === 3 ? null : 'secondary'"
              @click="selectedFloor = 3"
            >Servers D</Badge>
          </div>
          <div>
            <Badge
              :variant="selectedFloor === 4 ? null : 'secondary'"
              @click="selectedFloor = 4"
            >Office 1</Badge>
          </div>
          <div>
            <Badge
              :variant="selectedFloor === 5 ? null : 'secondary'"
              @click="selectedFloor = 5"
            >Office 2</Badge>
          </div>
          <div>
            <Badge
              :variant="selectedFloor === 6 ? null : 'secondary'"
              @click="selectedFloor = 6"
            >Office 3</Badge>
          </div>
          <div>
            <Badge
              :variant="selectedFloor === 7 ? null : 'secondary'"
              @click="selectedFloor = 7"
            >Office 4</Badge>
          </div>
          <div>
            <Badge
              :variant="selectedFloor === 8 ? null : 'secondary'"
              @click="selectedFloor = 8"
            >Office 5</Badge>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle id="demo-handle-6" :disabled="true" />
      <ResizablePanel id="demo-panel-3" :default-size="90">
        <div class="flex w-full h-full items-center justify-center">
          <Plans />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </ResizablePanel>
  <ResizableHandle id="demo-handle-12" :disabled="false" />
  <ResizablePanel id="demo-panel-6">
    <ResizablePanelGroup id="demo-group-3" direction="horizontal">
      <ResizablePanel id="demo-panel-9" :default-size="10">
        <div class="flex h-full w-full items-start justify-center p-6 border">
          <ul>
            <li><a
              href="#"
              class="link"
              :class="selectedItem === 0 ? 'font-bold' : ''"
              @click="selectedItem = 0"
            >Pending items (22)</a></li>
            <li><a
              href="#"
              class="link"
              :class="selectedItem === 1 ? 'font-bold' : ''"
              @click="selectedItem = 1"
            >Newest</a></li>
            <li><a
              href="#"
              class="link"
              :class="selectedItem === 2 ? 'font-bold' : ''"
              @click="selectedItem = 2"
            >Needs attention (5)</a></li>
            <li><a
              href="#"
              class="link"
              :class="selectedItem === 3 ? 'font-bold' : ''"
              @click="selectedItem = 3"
            >Successful (17)</a></li>
            <li><a
              href="#"
              class="link"
              :class="selectedItem === 4 ? 'font-bold' : ''"
              @click="selectedItem = 4"
            >Warnings (15)</a></li>
            <li><a
              href="#"
              class="link"
              :class="selectedItem === 5 ? 'font-bold' : ''"
              @click="selectedItem = 5"
            >Errors (5)</a></li>
            <li><a
              href="#"
              class="link"
              :class="selectedItem === 6 ? 'font-bold' : ''"
              @click="selectedItem = 6"
            >Info (18)</a></li>
            <li><a
              href="#"
              class="link"
              :class="selectedItem === 7 ? 'font-bold' : ''"
              @click="selectedItem = 7"
            >Linked to overheat/fire (2)</a></li>
            <li><a
              href="#"
              class="link"
              :class="selectedItem === 8 ? 'font-bold' : ''"
              @click="selectedItem = 8"
            >Linked to unauthorized door open (0)</a></li>
            <li><a
              href="#"
              class="link"
              :class="selectedItem === 9 ? 'font-bold' : ''"
              @click="selectedItem = 9"
            >Linked to unauthorized window open (0)</a></li>
          </ul>
        </div>
      </ResizablePanel>
      <ResizableHandle id="demo-handle-1" :disabled="true" />
      <ResizablePanel id="demo-panel-7" :default-size="38">
        <div class="flex h-full w-full border items-center justify-center">
          <Process />
        </div>
      </ResizablePanel>
      <ResizableHandle id="demo-handle-2" />
      <ResizablePanel id="demo-panel-8" :default-size="52">
        <div class="flex w-full">
          <ScrollArea class="h-[50%] w-full border">
            <EventsTable />
          </ScrollArea>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </ResizablePanel>
</ResizablePanelGroup>
</template>

<style scoped>
.link {
  font-size: 12px;
  text-decoration: underline;
}
</style>