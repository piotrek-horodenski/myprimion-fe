import { ISettings } from './settings.model'

export const defualtSettings: ISettings = {
  incidents: {
    apiUrl: 'http://192.168.162.235:9666/pinot-api',
    sseUrl: 'http://192.168.162.235:9666/pinot-api',
    processUrl: 'http://192.168.162.235:18081/processes'
  },
}
