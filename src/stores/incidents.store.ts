import axios from 'axios'
import { defineStore, storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

import { IIncident } from './incidents.model'
import { useSettingsStore } from './settings.store'

export const useIncidentsStore = defineStore('incidents', () => {
  const incidents = ref<IIncident[]>([])
  const error = ref<any>(null)
  const connectionError = ref<any>(null)
  const isLoading = ref(true)
  const isConnecting = ref(false)
  const { settings, isLoading: isSettingsLoading } = storeToRefs(useSettingsStore())
  const eventSource = ref<EventSource | null>(null)
  const getPagingQP = (offset: number, limit: number) => {
    return `?offset=${offset}&limit=${limit}`
  }
  const possibleEvents = [
    {
      type: 'message',
      action: (event: MessageEvent) => {
        const candidate = JSON.parse(event.data)
        const existing = incidents.value.find(i => i.id === candidate.id)

        if (existing) {
          Object.assign(existing, candidate)
        } else {
          incidents.value.unshift({
            ...candidate,
            created: new Date().getTime(),
          })
        }
      }
    },
  ]


  async function loadIncidents(offset: number, limit: number) {
    const path = settings.value.incidents.apiUrl + '/pinot/incidents'

    try {
      const response = await axios.get(path + getPagingQP(offset, limit))

      response.data.forEach(i => {
        if (incidents.value.find(incident => incident.id === i.id)) {
          return
        }
        incidents.value.push(i)
      })
    } catch (e) {
      error.value = e
    } finally {
    }

    await new Promise(resolve => {
      setTimeout(resolve, 1500)
    })
  }

  function updateOffsetLimit(offset: number, limit: number) {
    loadIncidents(offset, limit)
  }

  async function connectToSSE() {
    const path =  settings.value.incidents.sseUrl  + '/sse/incidents'

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

  async function init() {
    await loadIncidents(0, 10)
    isLoading.value = false
    connectToSSE()
  }

  watch(isSettingsLoading, (value) => {
    if (!value) {
      init()
    }
  })

  return {
    isLoading,
    incidents,
    error,
    connectionError,
    isConnecting,
    loadIncidents,
    updateOffsetLimit,
  }
})
