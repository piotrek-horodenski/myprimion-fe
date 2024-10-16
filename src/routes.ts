import Home from '@/components/pages/Home.vue'
import Plans from '@/components/pages/Plans.vue'
import Process from '@/components/pages/Process.vue'
import Events from '@/components/pages/Events.vue'
import Map from '@/components/pages/Map.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      label: 'Home',
      icon: 'home',
    },
  },
  {
    path: '/map',
    name: 'map',
    component: Map,
    meta: {
      label: 'Map',
      icon: 'map',
    },
  },
  {
    path: '/plans',
    name: 'plans',
    component: Plans,
    meta: {
      label: 'Plans',
      icon: 'motion_sensor_active',
    },
  },
  {
    path: '/process',
    name: 'process',
    component: Process,
    meta: {
      label: 'Process',
      icon: 'rebase_edit'
    },
  },
  {
    path: '/events',
    name: 'events',
    component: Events,
    meta: {
      label: 'Events',
      icon: 'event',
    },
  },
]
