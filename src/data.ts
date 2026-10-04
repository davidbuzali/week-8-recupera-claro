import type { ThreatPattern } from './types'

export const FEED_VERSION = 'RC-SIM-2026.10'

export const simulatedThreatFeed: ThreatPattern[] = [
  {
    id: 'supplier-lookalike',
    label: 'Dominio parecido al de un proveedor',
    syntheticIndicator: 'facturas-proveedor.example/cambio-clabe',
    category: 'fraude-de-pago',
    note: 'Patrón inventado: cambio urgente de cuenta de pago por un canal no verificado.',
  },
  {
    id: 'session-reset',
    label: 'Enlace falso de recuperación',
    syntheticIndicator: 'sesion-segura.example/recupera-ahora',
    category: 'toma-de-cuenta',
    note: 'Patrón inventado: presión para iniciar sesión desde un enlace recibido por mensaje.',
  },
  {
    id: 'identity-credit',
    label: 'Aviso de crédito no solicitado',
    syntheticIndicator: 'credito-alerta.example/confirma-identidad',
    category: 'suplantacion',
    note: 'Patrón inventado: solicitud inesperada de documentos para cancelar un crédito.',
  },
]

export const incidentPatternId = {
  account: 'session-reset',
  payment: 'supplier-lookalike',
  identity: 'identity-credit',
  multiple: 'supplier-lookalike',
} as const
