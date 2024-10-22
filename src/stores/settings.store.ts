import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

import { ISettings } from './settings.model'
import { defualtSettings } from './default-settings'

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
