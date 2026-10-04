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

export type Priority = 'inmediata' | 'alta' | 'estandar'

export interface RecoveryStep {
  id: string
  title: string
  detail: string
  why: string
  officialUrl?: string
  officialLabel?: string
}

export interface TriageResult {
  priority: Priority
  title: string
  summary: string
  confidence: number
  uncertainty: string
  reasons: string[]
  steps: RecoveryStep[]
}

export interface ThreatPattern {
  id: string
  label: string
  syntheticIndicator: string
  category: 'suplantacion' | 'toma-de-cuenta' | 'fraude-de-pago'
  note: string
}

export interface IndicatorMatch {
  pattern: ThreatPattern
  fingerprint: string
  feedVersion: string
}

export interface MinimizedHandoff {
  incident: string
  recency: string
  access: string
  money: string
  priority: Priority
  identityStatus: 'no verificada'
  excluded: string[]
}
