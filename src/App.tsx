import { useState } from 'react'
import type { Intake } from './types'

const initialIntake: Intake = { incident: '', recency: '', access: '', money: '' }

const incidentOptions = [
  { value: 'account', label: 'Cuenta tomada', detail: 'Perdiste acceso o alguien usa una cuenta sin permiso.' },
  { value: 'payment', label: 'Fraude de pago', detail: 'Hay un cargo, transferencia o instrucción de pago sospechosa.' },
  { value: 'identity', label: 'Robo de identidad', detail: 'Usaron tus datos para hacerse pasar por ti.' },
] as const

function App() {
  const [intake, setIntake] = useState<Intake>(initialIntake)
  const [message, setMessage] = useState('')

  const update = (key: keyof Intake, value: string) => {
    setIntake((current) => ({ ...current, [key]: value }))
    setMessage('')
  }

  const begin = () => {
    if (Object.values(intake).some((value) => !value)) {
      setMessage('Completa las cuatro decisiones para crear una ruta sin datos sensibles.')
      return
    }
    setMessage('Selecciones completas. La evaluación simulada se añadirá en el siguiente incremento.')
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
              <button className="primary-button" type="button" onClick={begin}>Crear mi ruta <span aria-hidden="true">→</span></button>
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
      </main>

      <footer>
        <p>Recupera Claro es un prototipo educativo. Personas, capacidad, incidentes y resultados son inventados.</p>
      </footer>
    </div>
  )
}

export default App
