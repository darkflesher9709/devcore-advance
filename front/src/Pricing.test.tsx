import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Pricing from './Pricing'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input)
    const body = url.endsWith('/services') ? [{
      id: 'srv-1', code: 'PKG-BAS', name: 'Paquete Básico', category: 'Paquetes de desarrollo',
      level: 'Básico', description: 'Tarifa inicial orientativa.', min_price: 1500000,
      max_price: 1500000, billing_unit: 'por proyecto', estimated_cost: 0,
      target_margin: 40, active: true, reference_only: true, provider: '', renewal_date: '',
      charged_to_client: false,
    }] : []
    return { ok: true, status: 200, json: async () => body } as Response
  }))
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

describe('módulo Precios', () => {
  it('carga los indicadores y tarifas desde la API, sin cotizaciones ficticias', async () => {
    await act(async () => {
      root.render(<Pricing />)
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    expect(container.textContent).toContain('Precios y cotizaciones')
    expect(container.textContent).toContain('Aún no hay cotizaciones guardadas.')
    expect(container.textContent).toContain('Valor cotizado$ 0')
    const servicesTab = [...container.querySelectorAll('button')].find((button) => button.textContent === 'Servicios')!
    act(() => servicesTab.click())
    expect(container.textContent).toContain('Paquete Básico')
    expect(container.textContent).toContain('1.500.000')
  })
})
