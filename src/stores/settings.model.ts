
export interface ISettings {
  incidents: ISettingsIncidents
}

export interface ISettingsIncidents {
  api: string
  apiPort: number
  sse: string
  ssePort: number
}
