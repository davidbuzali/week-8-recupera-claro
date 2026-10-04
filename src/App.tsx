import { useState } from 'react'
import { matchSimulatedIndicator, runSimulatedTriage, validateIntake } from './logic'
import type { IndicatorMatch, Intake, TriageResult } from './types'

const initialIntake: Intake = { incident: '', recency: '', access: '', money: '' }

const incidentOptions = [
  { value: 'account', label: 'Cuenta tomada', detail: 'Perdiste acceso o alguien usa una cuenta sin permiso.' },
  { value: 'payment', label: 'Fraude de pago', detail: 'Hay un cargo, transferencia o instrucción de pago sospechosa.' },
  { value: 'identity', label: 'Robo de identidad', detail: 'Usaron tus datos para hacerse pasar por ti.' },
] as const

function App() {
  const [intake, setIntake] = useState<Intake>(initialIntake)
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<TriageResult | null>(null)
  const [indicator, setIndicator] = useState<IndicatorMatch | null>(null)
  const [working, setWorking] = useState(false)

  const update = (key: keyof Intake, value: string) => {
    setIntake((current) => ({ ...current, [key]: value }))
    setMessage('')
    setResult(null)
    setIndicator(null)
  }

  const begin = async () => {
    const errors = validateIntake(intake)
    if (errors.length) {
      setMessage(errors.join(' '))
      return
    }
    setWorking(true)
    try {
      const nextResult = runSimulatedTriage(intake)
      const nextIndicator = await matchSimulatedIndicator(intake)
      setResult(nextResult)
      setIndicator(nextIndicator)
      setMessage('Ruta simulada creada. Revisa las razones y los límites antes de actuar.')
      window.setTimeout(() => document.getElementById('resultado')?.focus(), 0)
    } catch {
      setMessage('No pudimos crear la ruta. Revisa las cuatro selecciones e intenta de nuevo.')
    } finally {
      setWorking(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Recupera Claro, inicio">
          <span className="brand-mark" aria-hidden="true">RC</span>
          <span>Recupera <strong>Claro</strong></span>
        </a>
        <span className="simulated-pill">Prototipo · datos simulados</span>
      </header>

      <main id="contenido">
        <section className="hero" id="inicio">
          <div>
            <p className="eyebrow">Respuesta digital para personas y pequeños negocios en México</p>
            <h1>Primero, recupera el control.</h1>
            <p className="lede">Ordena tus siguientes pasos después de una cuenta tomada, fraude de pago o robo de identidad. Sin pegar secretos. Sin promesas falsas.</p>
          </div>
          <aside className="boundary-card" aria-label="Límites importantes">
            <span className="boundary-icon" aria-hidden="true">!</span>
            <div>
              <strong>Este sitio no verifica tu identidad.</strong>
              <p>No revierte transferencias, no recupera cuentas y no reemplaza a tu banco, plataforma o autoridad.</p>
            </div>
          </aside>
        </section>

        <section className="privacy-banner" aria-label="Aviso de privacidad">
          <strong>No pegues contraseñas, códigos, llaves, datos bancarios, identificaciones ni archivos filtrados.</strong>
          <span>Solo usamos las opciones que eliges y no las guardamos.</span>
        </section>

        <section className="triage-layout" aria-labelledby="triage-title">
          <div className="triage-card">
            <div className="section-heading">
              <span className="step-number">1</span>
              <div>
                <p className="eyebrow">Evaluación inicial</p>
                <h2 id="triage-title">¿Qué pasó?</h2>
              </div>
            </div>

            <fieldset className="option-grid">
              <legend>Elige el tipo de incidente</legend>
              {incidentOptions.map((option) => (
                <label className={`choice-card ${intake.incident === option.value ? 'selected' : ''}`} key={option.value}>
                  <input type="radio" name="incident" value={option.value} checked={intake.incident === option.value} onChange={(event) => update('incident', event.target.value)} />
                  <span><strong>{option.label}</strong><small>{option.detail}</small></span>
                </label>
              ))}
            </fieldset>

            <div className="select-grid">
              <label>
                <span>¿Cuándo ocurrió?</span>
                <select value={intake.recency} onChange={(event) => update('recency', event.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="now">Está ocurriendo ahora</option>
                  <option value="today">En las últimas 24 horas</option>
                  <option value="older">Hace más de 24 horas</option>
                </select>
              </label>
              <label>
                <span>¿Todavía tienes acceso?</span>
                <select value={intake.access} onChange={(event) => update('access', event.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="lost">No tengo acceso</option>
                  <option value="partial">Solo a algunas partes</option>
                  <option value="control">Sí, conservo el control</option>
                </select>
              </label>
              <label>
                <span>¿Hay dinero en riesgo?</span>
                <select value={intake.money} onChange={(event) => update('money', event.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="loss">Sí, ya hubo un movimiento</option>
                  <option value="attempt">Hubo un intento</option>
                  <option value="none">No que yo sepa</option>
                </select>
              </label>
            </div>

            <div className="action-row">
              <p className="form-message" role="status" aria-live="polite">{message}</p>
              <button className="primary-button" type="button" onClick={begin} disabled={working}>{working ? 'Creando ruta…' : 'Crear mi ruta'} <span aria-hidden="true">→</span></button>
            </div>
          </div>

          <aside className="side-stack">
            <div className="side-card">
              <p className="eyebrow">Cómo funciona</p>
              <ol className="progress-list">
                <li className="active"><span>1</span><div><strong>Describe sin secretos</strong><small>Cuatro decisiones cerradas</small></div></li>
                <li><span>2</span><div><strong>Revisa la ruta</strong><small>Razones, dudas y fuentes</small></div></li>
                <li><span>3</span><div><strong>Practica y escala</strong><small>Con apoyo humano si hay cupo</small></div></li>
              </ol>
            </div>
            <div className="capacity-card">
              <span className="status-dot" aria-hidden="true"></span>
              <div><strong>Revisión humana simulada</strong><p>3 lugares disponibles · meta de respuesta: 30 min</p></div>
            </div>
          </aside>
        </section>

        {result && indicator && (
          <section className="results-section" id="resultado" tabIndex={-1} aria-labelledby="result-title">
            <div className="result-header">
              <div>
                <p className="eyebrow">Evaluación de IA simulada · no es un diagnóstico</p>
                <h2 id="result-title">{result.title}</h2>
                <p>{result.summary}</p>
              </div>
              <div className={`priority-badge priority-${result.priority}`}>
                <span>Prioridad sugerida</span>
                <strong>{result.priority}</strong>
              </div>
            </div>

            <div className="explain-grid">
              <article className="explain-card">
                <span className="card-kicker">Por qué salió esta ruta</span>
                <ul>{result.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
                <p className="confidence"><strong>Consistencia del escenario: {Math.round(result.confidence * 100)}%</strong> · No mide certeza sobre un incidente real.</p>
              </article>
              <article className="explain-card uncertainty-card">
                <span className="card-kicker">Lo que no sabemos</span>
                <p>{result.uncertainty}</p>
                <strong>Una persona debe verificar identidad y contexto por un canal externo confiable.</strong>
              </article>
              <article className="explain-card feed-card">
                <span className="card-kicker">Comparación estructurada · simulada</span>
                <h3>{indicator.pattern.label}</h3>
                <p>{indicator.pattern.note}</p>
                <dl>
                  <div><dt>Feed inventado</dt><dd>{indicator.feedVersion}</dd></div>
                  <div><dt>Categoría</dt><dd>{indicator.pattern.category}</dd></div>
                  <div><dt>Huella local</dt><dd><code>{indicator.fingerprint.slice(0, 16)}…</code></dd></div>
                </dl>
                <small>SHA-256 calculado en tu navegador sobre un indicador inventado. No se envía ni guarda el valor original.</small>
              </article>
            </div>

            <div className="route-block">
              <div className="section-heading compact">
                <span className="step-number">2</span>
                <div><p className="eyebrow">Ruta priorizada</p><h2>Haz una cosa a la vez</h2></div>
              </div>
              <ol className="route-list">
                {result.steps.map((step, index) => (
                  <li key={step.id}>
                    <span className="route-index">{index + 1}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.detail}</p>
                      <details><summary>¿Por qué va aquí?</summary><p>{step.why}</p></details>
                      {step.officialUrl && <a href={step.officialUrl} target="_blank" rel="noreferrer">{step.officialLabel} <span aria-hidden="true">↗</span></a>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
      </main>

      <footer>
        <p>Recupera Claro es un prototipo educativo. Personas, capacidad, incidentes y resultados son inventados.</p>
      </footer>
    </div>
  )
}

export default App
