
export enum IIncidentTypeEnum {
  FIRE = 'FIRE',
  HEAT = 'HEAT',
  DOOR = 'DOOR',
  WINDOW = 'WINDOW',
}

export interface IIncident {
  datetime: string
  type: IIncidentTypeEnum
  description: string
  roomId: string
  deviceId: string
}

export interface IIncidentWithTemperature extends IIncident {
  temperature: number
}
