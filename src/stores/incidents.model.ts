
export enum IIncidentTypeEnum {
  LOW_BATTERY = 'LOW_BATTERY',
  HUMIDITY_TO_LOW = 'HUMIDITY_TO_LOW',
  TEMP_WARNING = 'TEMP_WARNING',
  TEMP_ALERT = 'TEMP_ALERT',
  DEVICE_MOVE_ALARM = 'DEVICE_MOVE_ALARM',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
}

export enum IIncidentSeverity {
  LOW = 'LOW',
  MINOR = 'MINOR',
  MAJOR = 'MAJOR',
  CRITICAL = 'CRITICAL',
}

export interface ITemperatureSensorMetrics {
  temperature: number
  humidity: number
  pressure: number
}

export type IMetrics = ITemperatureSensorMetrics

export interface IIncident {
  id: string
  timestamp: string
  affectedRoomId: string
  rootCause: string
  roomName: string
  incidentDescription: string
  incidentType: IIncidentTypeEnum
  thingMetrics: IMetrics
  severity: IIncidentSeverity
  created?: string
}
