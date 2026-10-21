import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root.render(<App />))
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  window.history.replaceState(null, '', window.location.pathname)
})

function openPage(href: string) {
  const link = container.querySelector<HTMLAnchorElement>(`a[href="${href}"]`)
  if (!link) throw new Error(`No se encontró el enlace ${href}`)
  act(() => link.click())
}

describe('portafolio', () => {
  it('muestra el catálogo de prototipos con su estado explícito', () => {
    openPage('#prototipos')
    expect(container.textContent).toContain('GOLPRED')
    expect(container.textContent).toContain('Prototipo visual')
  })

  it('busca proyectos y presenta un estado vacío recuperable', () => {
    openPage('#prototipos')
    const search = container.querySelector<HTMLInputElement>('[aria-label="Buscar proyectos o tecnologías"]')!
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(search, 'nada coincide')
      search.dispatchEvent(new Event('input', { bubbles: true }))
    })
    expect(container.textContent).toContain('No encontramos coincidencias')
    const clear = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Limpiar filtros'))!
    act(() => clear.click())
    expect(container.textContent).toContain('GOLPRED')
  })

  it('abre y cierra el detalle del prototipo', () => {
    openPage('#prototipos')
    const open = container.querySelector<HTMLButtonElement>('[aria-label="Ver detalle de Excel Automation"]')!
    act(() => open.click())
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain('Arquitectura y reto')
    act(() => container.querySelector<HTMLButtonElement>('[aria-label="Cerrar detalle"]')!.click())
    expect(container.querySelector('[role="dialog"]')).toBeNull()
  })

  it('muestra el prototipo AOT con una demo de mercado claramente simulada', () => {
    openPage('#prototipos')
    const open = container.querySelector<HTMLButtonElement>('[aria-label="Ver detalle de AOT"]')!
    act(() => open.click())
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain('Panel de mercado')
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain('DATOS SINTÉTICOS')
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain('No ofrece asesoría financiera')
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain('AOT Trading Desk')
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain('La información de mercado puede resultar dispersa')
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain('Gráficos financieros y volumen')
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain('futuras integraciones con fuentes financieras')
    expect(container.querySelectorAll('.software-reference-gallery img')).toHaveLength(2)
    expect(container.querySelector('.software-reference-gallery img')?.getAttribute('src')).toBe('/images/aoc-analytics.png')
    act(() => container.querySelector<HTMLButtonElement>('.aoc-reference-open')!.click())
    expect(container.querySelector('.aoc-lightbox img')?.getAttribute('src')).toBe('/images/aoc-analytics.png')
    const cancelZoom = [...container.querySelectorAll<HTMLButtonElement>('.aoc-lightbox button')].find((button) => button.textContent?.includes('Cancelar'))!
    act(() => cancelZoom.click())
    expect(container.querySelector('.aoc-lightbox')).toBeNull()
    expect(container.querySelectorAll('.software-reference-gallery img')).toHaveLength(2)
    const timeframe = container.querySelector<HTMLButtonElement>('.aoc-timeframes button:last-child')!
    act(() => timeframe.click())
    expect(timeframe.getAttribute('aria-pressed')).toBe('true')
  })

  it('muestra el prototipo GOLPRED con partidos, tabla y pronóstico ficticio', () => {
    openPage('#prototipos')
    const logo = container.querySelector<HTMLImageElement>('.golpred-card-logo img')!
    expect(logo.getAttribute('src')).toBe('/images/golpred-logo.png')
    act(() => logo.click())
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain('Datos para explorar partidos')
    expect(container.querySelector('.golpred-brand img')?.getAttribute('src')).toBe('/images/golpred-logo.png')
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain('GOLPRED – Football Intelligence')
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain('La información deportiva está dispersa entre múltiples fuentes')
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain('Combinadas de partidos y jugadores.')
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain('mediante métricas estadísticas')
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain('pronósticos cuantificables, transparentes y evaluables')
    expect(container.querySelector('[role="dialog"]')!.textContent!.indexOf('Objetivo')).toBeLessThan(container.querySelector('[role="dialog"]')!.textContent!.indexOf('Datos para explorar partidos'))
    expect(container.querySelectorAll('.software-reference-gallery img')).toHaveLength(5)
    expect(container.querySelector('.software-reference-gallery img')?.getAttribute('src')).toBe('/images/golpred-overview.png')
    const forecast = [...container.querySelectorAll<HTMLButtonElement>('.golpred-match button')].find((button) => button.textContent?.includes('Ver pronóstico'))!
    act(() => forecast.click())
    expect(container.querySelector('.golpred-probabilities')?.textContent).toContain('42%')
    expect(container.querySelector('.golpred-safety-note')?.textContent).toContain('son ficticios')
    const standings = [...container.querySelectorAll<HTMLButtonElement>('.golpred-tabs button')].find((button) => button.textContent === 'Tabla')!
    act(() => standings.click())
    expect(container.querySelector('.golpred-standings-view')?.textContent).toContain('Tabla ilustrativa')
    const access = [...container.querySelectorAll<HTMLButtonElement>('.golpred-tabs button')].find((button) => button.textContent === 'Acceso')!
    act(() => access.click())
    expect(container.querySelector('.golpred-access-view')?.textContent).toContain('autenticación aún no está conectada')
    expect(container.querySelector<HTMLInputElement>('.golpred-access-view input')?.disabled).toBe(true)
  })

  it('mantiene los proyectos reales y los prototipos en páginas separadas', () => {
    openPage('#proyectos')
    expect(container.textContent).toContain('Aún no hay proyectos agregados')
    expect(container.textContent).not.toContain('GOLPRED')
    openPage('#prototipos')
    expect(container.textContent).toContain('GOLPRED')
    expect(container.textContent).not.toContain('Aún no hay proyectos agregados')
    openPage('#laboratorio')
    expect(container.textContent).toContain('Ideas que se convierten en')
    expect(container.textContent).not.toContain('Prueba ideas')
    expect([...container.querySelectorAll('nav a')].some((link) => link.textContent === 'Laboratorio')).toBe(false)
  })
})
