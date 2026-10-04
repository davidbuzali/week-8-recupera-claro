import { FEED_VERSION, incidentPatternId, simulatedThreatFeed } from './data.ts'
import type { IndicatorMatch, Intake, MinimizedHandoff, TriageResult } from './types.ts'

const incidents = new Set(['account', 'payment', 'identity', 'multiple'])
const recencies = new Set(['now', 'today', 'older'])
const accessStates = new Set(['lost', 'partial', 'control'])
const moneyStates = new Set(['loss', 'attempt', 'none'])

export function validateIntake(value: Intake): string[] {
  const errors: string[] = []
  if (!incidents.has(value.incident)) errors.push('Selecciona un tipo de incidente válido.')
  if (!recencies.has(value.recency)) errors.push('Selecciona cuándo ocurrió.')
  if (!accessStates.has(value.access)) errors.push('Selecciona tu estado de acceso.')
  if (!moneyStates.has(value.money)) errors.push('Selecciona si hay dinero en riesgo.')
  return errors
}

export function runSimulatedTriage(intake: Intake): TriageResult {
  const errors = validateIntake(intake)
  if (errors.length) throw new Error(errors.join(' '))

  const bankFirst = intake.money === 'loss' && (intake.recency === 'now' || intake.recency === 'today')
  const platformFirst = (intake.incident === 'account' || intake.incident === 'multiple') && intake.access !== 'control'
  const priority = bankFirst || (platformFirst && intake.recency === 'now') ? 'inmediata' : intake.money !== 'none' || intake.access === 'lost' ? 'alta' : 'estandar'

  const bankStep = {
    id: 'bank',
    title: 'Contacta a tu banco desde su canal oficial',
    detail: 'Usa el número de tu tarjeta o la app que ya tenías instalada. Pide un folio y anota la hora.',
    why: 'Una institución financiera es la única que puede revisar, bloquear o disputar un movimiento.',
  }
  const platformStep = {
    id: 'platform',
    title: 'Abre la recuperación oficial de la plataforma',
    detail: 'Escribe tú mismo la dirección conocida. No uses el enlace del mensaje que originó la alerta.',
    why: 'Solo la plataforma puede restaurar una sesión o cuenta; este prototipo no puede hacerlo.',
  }
  const preserveStep = {
    id: 'evidence',
    title: 'Preserva evidencia mínima',
    detail: 'Guarda folio, fecha, hora, institución y una captura sin contraseñas, códigos ni documentos completos.',
    why: 'Un registro mínimo ayuda a explicar la secuencia sin crear otro depósito de datos sensibles.',
  }
  const authorityStep = {
    id: 'authority',
    title: 'Solicita orientación oficial si hubo un posible delito',
    detail: 'La Guardia Nacional publica el 088 como canal de orientación y denuncia. Decide tú si deseas contactar.',
    why: 'La autoridad puede orientar el proceso; este sitio no presenta denuncias en tu nombre.',
    officialUrl: 'https://www.gob.mx/guardianacional/acciones-y-programas/denuncia-por-internet-ante-la-guardia-nacional',
    officialLabel: 'Abrir página oficial de Guardia Nacional 088',
  }

  const firstSteps = bankFirst ? [bankStep, platformStep] : platformFirst ? [platformStep, bankStep] : [preserveStep, platformStep]
  const uniqueSteps = [...firstSteps, preserveStep, authorityStep].filter((step, index, all) => all.findIndex((item) => item.id === step.id) === index)

  const reasons = [
    bankFirst ? 'Reportaste un movimiento y ocurrió hace menos de 24 horas.' : 'No hay una pérdida reciente confirmada que obligue a poner al banco primero.',
    platformFirst ? 'Reportaste acceso perdido o parcial a una cuenta.' : 'Reportaste que aún conservas el control o que el incidente no es una toma de cuenta.',
    'La ruta mantiene verificación, bloqueo y recuperación en manos de la institución correspondiente.',
  ]

  return {
    priority,
    title: bankFirst ? 'Primero: canal oficial de tu banco' : platformFirst ? 'Primero: recuperación oficial de la cuenta' : 'Primero: registra lo mínimo y verifica el canal',
    summary: 'Esta ruta ordena acciones plausibles a partir de cuatro categorías. No evalúa evidencia real ni confirma que el incidente ocurrió.',
    ruleMatch: bankFirst || platformFirst ? 'alta' : 'media',
    uncertainty: 'No conocemos la institución, la identidad de quien solicita ayuda, la evidencia real ni el resultado de acciones externas.',
    reasons,
    steps: uniqueSteps,
  }
}

export async function matchSimulatedIndicator(intake: Intake): Promise<IndicatorMatch> {
  if (!incidents.has(intake.incident)) throw new Error('No hay un incidente válido para comparar.')
  const patternId = incidentPatternId[intake.incident as keyof typeof incidentPatternId]
  const pattern = simulatedThreatFeed.find((item) => item.id === patternId)
  if (!pattern) throw new Error('No se encontró el patrón simulado.')
  const bytes = new TextEncoder().encode(pattern.syntheticIndicator)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  const fingerprint = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
  return { pattern, fingerprint, feedVersion: FEED_VERSION }
}

export function canRequestReview(capacity: number): boolean {
  return Number.isInteger(capacity) && capacity > 0 && capacity <= 3
}

export function buildMinimizedHandoff(intake: Intake, result: TriageResult): MinimizedHandoff {
  const errors = validateIntake(intake)
  if (errors.length) throw new Error(errors.join(' '))
  return {
    incident: intake.incident,
    recency: intake.recency,
    access: intake.access,
    money: intake.money,
    priority: result.priority,
    identityStatus: 'no verificada',
    excluded: ['nombre', 'correo', 'telefono', 'contrasenas', 'codigos', 'datos bancarios', 'documentos', 'archivos filtrados'],
  }
}
