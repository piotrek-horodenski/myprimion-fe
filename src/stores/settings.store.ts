import { defineStore } from 'pinia'
import { ref } from 'vue'

import { ISettings } from './incidents.model'
import axios from 'axios'

export const defualtSettings = {
  incidents: {
    api: '192.168.162.235',
    apiPort: 9666,
    apiPath: '/pinot',
    sse: '192.168.162.235',
    ssePort: 9666,
    ssePath: '/sse',
  },
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<ISettings>({
    ...defualtSettings,
  })
  const error = ref<any>(null)
  const isLoading = ref(true)

  async function loadSettings() {
    try {
      isLoading.value = true
      const response = await axios.get('/settings.json')

      settings.value = response.data
    } catch (e) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  loadSettings()

  return { settings, isLoading, error }
})
