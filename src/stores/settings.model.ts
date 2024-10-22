
export interface ISettings {
  incidents: ISettingsIncidents
}

export interface ISettingsIncidents {
  apiUrl: string
  sseUrl: string
  processUrl: string
}
