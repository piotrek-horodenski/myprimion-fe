<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import {
  VisAxis,
  VisXYContainer,
  VisGroupedBar,
} from '@unovis/vue'

import { useIncidentsStore } from '@/stores/incidents.store'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'
import { IIncidentSeverity, IIncidentTypeEnum } from '@/stores/incidents.model'
import { howLongAgo } from '@/lib/how-long-ago.service'

const currentPage = ref(1)
const { updateOffsetLimit } = useIncidentsStore()
const { incidents } = storeToRefs(useIncidentsStore())
const currentTime = ref(new Date().getTime())
const interval = ref<any>(null)
const knownIds = ref<[]>([])
const isSetup = ref<boolean>(true)
const currentIncidents = computed(() => {
  return incidents.value
    // .sort((a, b) => {
    //   return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    // })
    .slice((currentPage.value - 1) * 10, currentPage.value * 10)
    .map(incident => {
      return {
        ...incident,
        howLongAgo: howLongAgo(incident.created || new Date(incident.timestamp).getTime(), currentTime.value),
        classes: knownIds.value.includes(incident.id) || isSetup.value ? '' : 'background-red',
      }
    })
})

watch(() => incidents, () => {
  setTimeout(() => {
    incidents.value.forEach(incident => {
      if (!knownIds.value.includes(incident.id)) {
        knownIds.value.push(incident.id)
      }
    })
  }, 100)
}, { immediate: true, deep: true })

const iconsByIncidentType = {
  [IIncidentTypeEnum.LOW_BATTERY]: 'battery_0_bar',
  [IIncidentTypeEnum.HUMIDITY_TO_LOW]: 'humidity_low',
  [IIncidentTypeEnum.TEMP_WARNING]: 'device_thermostat',
  [IIncidentTypeEnum.TEMP_ALERT]: 'device_thermostat',
}

const colorByIncidentType = {
  [IIncidentTypeEnum.LOW_BATTERY]: 'warning',
  [IIncidentTypeEnum.HUMIDITY_TO_LOW]: 'warning',
  [IIncidentTypeEnum.TEMP_WARNING]: 'warning',
  [IIncidentTypeEnum.TEMP_ALERT]: 'error',
}

const colorByIncidentSeverity = {
  [IIncidentSeverity.LOW]: 'success',
  [IIncidentSeverity.MINOR]: 'info',
  [IIncidentSeverity.MAJOR]: 'warning',
  [IIncidentSeverity.CRITICAL]: 'error',
}

const variantByIncidentSeverity = {
  [IIncidentSeverity.LOW]: '',
  [IIncidentSeverity.MINOR]: 'outline',
  [IIncidentSeverity.MAJOR]: 'secondary',
  [IIncidentSeverity.CRITICAL]: 'destructive',
}

const possibleAlerts = ['info', 'success', 'warning', 'error']
const possibleColors = ['outline', '', 'secondary', 'destructive']
const possibleInputs = [
  'temperature',
  'smoke',
  'door',
  'window',
]
const possibleIcons = [
  'thermometer',
  'emergency_heat',
  'door_open',
  'toolbar',
]

const timeStamp0 = new Date().getTime()

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

function incidentTypeName(value) {
  const values = {
    LOW_BATTERY: 'Low battery level',
    HUMIDITY_TO_LOW: 'Humidity to low',
    TEMP_WARNING: 'Temperature sensor warning',
    TEMP_ALERT: 'Temperature sensor alert',
  }

  return values[value]
}

const events = Array.from(new Array(10))
  .map(() => {
    const random = Math.random() * 50000
    const statusType = Math.floor(Math.random() * possibleAlerts.length)
    const inputType = Math.floor(Math.random() * possibleInputs.length)
    let params = ''
    if (statusType === 3 && inputType === 1) {
      params = 'Fire detected!'
    }
    if (statusType === 2 && inputType === 0) {
      params = 'Temperature rising!'
    }
    if (statusType === 3 && inputType === 0) {
      params = 'Temperature too hight!'
    }
    if (statusType === 0 && inputType === 0) {
      params = 'Temperature falling.'
    }
    if (statusType === 1 && inputType === 0) {
      params = 'Temperature normal.'
    }
    return {
      id: uuidv4(),
      timeStamp: moment(new Date(timeStamp0 - random)).format('yyyy-MM-DD HH:mm:ss'),
      status: possibleAlerts[statusType],
      color: possibleColors[statusType],
      inputType: possibleInputs[inputType],
      icon: possibleIcons[inputType],
      params,
      floorId: uuidv4(),
    }
  })

const data2 = [
  {
    x: 1,
    y: 55,
    y1: 33,
    y2: 22,
    y3: 2,
  },
  {
    x: 2,
    y: 33,
    y1: 22,
    y2: 15,
    y3: 4,
  },
  {
    x: 3,
    y: 22,
    y1: 15,
    y2: 66,
    y3: 1,
  },
  {
    x: 4,
    y: 15,
    y1: 26,
    y2: 55,
    y3: 20,
  },
]
const d2x = (d: DataRecord) => d.x
const d2y = [
  (d: DataRecord) => d.y,
  (d: DataRecord) => d.y1,
  (d: DataRecord) => d.y2,
  (d: DataRecord) => d.y3
]

function formatDateTime(timestamp: string) {
  const d = moment(timestamp)

  return d.format('YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  interval.value = setInterval(() => {
    currentTime.value = new Date().getTime()
  }, 50)

  setTimeout(() => {
    isSetup.value = false
  }, 300)
})

onUnmounted(() => {
  clearInterval(interval.value)
})

</script>
<template>
<div class="p-4 w-full h-full">
  <div class="flex flex-row justify-between">
    <Drawer>
      <DrawerTrigger as-child>
        <Button variant="outline">
          Show chart
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div class="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle class="text-center">Last 4 days</DrawerTitle>
            <DrawerDescription class="text-center">Sensors status occurences</DrawerDescription>
          </DrawerHeader>
        </div>
        <div class="mx-auto w-full">
          <div class="p-4 pb-0">
            <VisXYContainer :data="data2">
              <VisGroupedBar :x="d2x" :y="d2y" />
              <VisAxis type="x" />
              <VisAxis type="y" />
            </VisXYContainer>
          </div>
          <DrawerFooter>
            <DrawerClose as-child>
              <Button variant="outline">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
    <Pagination
      v-slot="{ page }"
      :total="incidents.length"
      :sibling-count="1"
      show-edges
      v-model:page="currentPage"
      :default-page="1"
      class="text-right"
    >
      <PaginationList v-slot="{ items }" class="flex items-center gap-1">
        <PaginationFirst />
        <PaginationPrev />

        <template v-for="(item, index) in items">
          <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
            <Button class="w-9 h-9 p-0" :variant="item.value === page ? 'default' : 'outline'">
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <PaginationNext />
        <PaginationLast />
      </PaginationList>
    </Pagination>
  </div>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>
          <span
            v-tooltip="{ content: 'Date and time of the incident' }"
          >Date time</span>
        </TableHead>
        <TableHead class="w-[130px]"><span
            v-tooltip="{ content: 'Incident severity' }"
          >Severity</span></TableHead>
        <TableHead><span
            v-tooltip="{ content: 'Incident type' }"
          >Type</span></TableHead>
        <TableHead><span
            v-tooltip="{ content: 'Incident details' }"
          >Details</span></TableHead>
        <TableHead><span
            v-tooltip="{ content: 'Room name' }"
          >Room</span></TableHead>
        <TableHead class="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-for="(incident, idx) in currentIncidents"
        :key="incident.id"
        class="background-animated"
        :class="incident.classes"
      >
        <TableCell class="font-medium">
          <span
            v-tooltip="{
              content: incident.howLongAgo + ' ago'
            }"
          >
            {{ formatDateTime(incident.timestamp) }}
          </span>
        </TableCell>
        <TableCell>
          <Badge
            class="badge"
            :class="'badge-' + colorByIncidentSeverity[incident.severity]"
            :variant="variantByIncidentSeverity[incident.severity] || ''"
          >{{ incident.severity }}</Badge>
          
        </TableCell>
        <TableCell>
          <em
            class="material-symbols-outlined cursor-pointer incident-type"
            :class="colorByIncidentType[incident.incidentType]"
            v-tooltip="{
              content: incidentTypeName(incident.incidentType)
            }"
          >{{ iconsByIncidentType[incident.incidentType] }}</em>
        </TableCell>
        <TableCell>{{ incident.incidentDescription }}</TableCell>
        <TableCell><strong>{{ incident.roomName }}</strong></TableCell>
        <TableCell class="text-right">
          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline">
                <em class="material-symbols-outlined cursor-pointer">more_vert</em>
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-60">
              <div class="grid gap-4">
                <div class="space-y-2">
                  <h4 class="font-medium leading-none">
                    Actions
                  </h4>
                  <p class="text-sm text-muted-foreground">
                    Decide what to do
                  </p>
                </div>
                <div class="grid gap-2">
                  <div class="items-center gap-4">
                    <Button class="w-full">Go to sensor details</Button>
                  </div>
                  <div class="items-center gap-4">
                    <Button variant="outline" class="w-full">Filter {{ incident.incidentType }} incidents</Button>
                  </div>
                  <div class="items-center gap-4">
                    <Button variant="outline" class="w-full">Filter {{ incident.severity }} incidents</Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <div class="flex flex-row justify-end">
    <Pagination
      v-slot="{ page }"
      :total="incidents.length"
      :sibling-count="1"
      show-edges
      :default-page="1"
      v-model:page="currentPage"
    >
      <PaginationList v-slot="{ items }" class="flex items-center gap-1">
        <PaginationFirst />
        <PaginationPrev />

        <template v-for="(item, index) in items">
          <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
            <Button class="w-9 h-9 p-0" :variant="item.value === page ? 'default' : 'outline'">
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <PaginationNext />
        <PaginationLast />
      </PaginationList>
    </Pagination>
  </div>
</div>
</template>
<style type="scss" scoped>

.badge-success {
  background-color: var(--vis-color3) !important;
  color: #000;
}

.badge-info {
  background-color: var(--vis-color0) !important;
  color: #fff;
}
.badge-warning {
  background-color: var(--vis-color2) !important;
}

.incident-type {
  text-shadow: .5px .5px 2px rgba(0, 0, 0, .7);

  &.warning {
    color: var(--vis-color2);
  }

  &.error {
    color: hsl(var(--destructive));
  }
}

.background-animated {
  background-color: rgba(243, 195, 0, 0);
  transition: background-color 2s ease-in-out;
}

.background-red {
  background-color:rgba(243, 195, 0, 0.3);
}

</style>