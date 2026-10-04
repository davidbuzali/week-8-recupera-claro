export type IncidentType = 'account' | 'payment' | 'identity'
export type Recency = 'now' | 'today' | 'older'
export type AccessStatus = 'lost' | 'partial' | 'control'
export type MoneyStatus = 'loss' | 'attempt' | 'none'

export interface Intake {
  incident: IncidentType | ''
  recency: Recency | ''
  access: AccessStatus | ''
  money: MoneyStatus | ''
}
