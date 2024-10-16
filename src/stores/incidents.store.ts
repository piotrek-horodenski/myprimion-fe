import axios from 'axios'
import { defineStore, storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

import { IIncident } from './incidents.model'
import { useSettingsStore } from './settings.store'

export const useIncidentsStore = defineStore('incidents', () => {
  const incidents = ref<IIncident[]>([])
  const error = ref<any>(null)
  const connectionError = ref<any>(null)
  const isLoading = ref(false)
  const isConnecting = ref(false)
  const { settings, isLoading: isSettingsLoading } = storeToRefs(useSettingsStore())
  const eventSource = ref<EventSource | null>(null)
  const getPagingQP = (page: number, size: number) => {
    return `?page=${page}&perPage=${size}`
  }
  const possibleEvents = [
    {
      type: 'message',
      action: (data: any) => {
        console.log('event', 'message', data)
      }
    },
  ]

  async function loadIncidents(page: number, size: number) {
    const path = 'http://' + settings.value.incidents.api +
      ':' + settings.value.incidents.apiPort +
      settings.value.incidents.apiPath + '/incidents'

    try {
      isLoading.value = true
      const response = await axios.get(path + getPagingQP(page, size))

      incidents.value = response.data
    } catch (e) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  async function connectToSSE() {
    const path = 'http://' + settings.value.incidents.sse +
      ':' + settings.value.incidents.ssePort +
      settings.value.incidents.ssePath + '/incidents'
    
    try {
      isConnecting.value = true
      eventSource.value = new EventSource(path)

      possibleEvents.forEach(event => {
        eventSource.value?.addEventListener(event.type, event.action)
      })
    } catch (e) {
      console.log('error connecting')
      console.dir(e)
      connectionError.value = e
    } finally {
      isConnecting.value = false
    }
  }

  function init() {
    connectToSSE()
    loadIncidents(1, 10)
  }

  watch(isSettingsLoading, (value) => {
    if (!value) {
      init()
    }
  })

  return { incidents, error, connectionError, loadIncidents }
})
