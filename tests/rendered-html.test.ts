import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const distHtml = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8')
const vercel = readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')

test('production page has Spanish metadata and accessibility entry points', () => {
  assert.match(distHtml, /lang="es-MX"/)
  assert.match(distHtml, /Saltar al contenido/)
  assert.match(distHtml, /viewport/)
})

test('deployment headers deny sensitive browser capabilities', () => {
  assert.match(vercel, /microphone=\(\)/)
  assert.match(vercel, /camera=\(\)/)
  assert.match(vercel, /geolocation=\(\)/)
  assert.match(vercel, /payment=\(\)/)
  assert.match(vercel, /frame-ancestors 'none'/)
  assert.match(vercel, /style-src 'self'/)
  assert.doesNotMatch(vercel, /style-src 'self' 'unsafe-inline'/)
})

test('source contains required boundaries and no environment file', () => {
  const sourceDir = new URL('../src/', import.meta.url)
  const source = readdirSync(sourceDir)
    .filter((file) => /\.(ts|tsx)$/.test(file))
    .map((file) => readFileSync(join(fileURLToPath(sourceDir), file), 'utf8'))
    .join('\n')
  assert.match(source, /Evaluación de IA simulada/)
  assert.match(source, /No se envió nada/)
  assert.match(source, /no verifica tu identidad/i)
  assert.doesNotMatch(source, /sk-[A-Za-z0-9]{20,}/)
})
