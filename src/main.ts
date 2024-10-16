import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style.css'
import App from './App.vue'
import { router } from './router'
import FloatingVue from 'floating-vue'
import {
  // Directives
  vTooltip,
  vClosePopper,
  // Components
  Dropdown,
  Tooltip,
  Menu
} from 'floating-vue'
import 'floating-vue/dist/style.css'

const pinia = createPinia()
const app = createApp(App)


app.directive('tooltip', vTooltip)
app.directive('close-popper', vClosePopper)

app.component('VDropdown', Dropdown)
app.component('VTooltip', Tooltip)
app.component('VMenu', Menu)

app
  .use(router)
  .use(pinia)
  .use(FloatingVue)
  .mount('#app')
