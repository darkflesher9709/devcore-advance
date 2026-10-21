import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Studio, { buildPreviewHtml } from './Studio'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  window.localStorage.clear()
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root.render(<Studio />))
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

describe('Studio', () => {
  it('creates an editable page alternative from a plain-language goal', () => {
    const goal = container.querySelector<HTMLTextAreaElement>('textarea[placeholder*="quiero que las personas"]')!
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(goal, 'Quiero mostrar mis postres y recibir reservas')
      goal.dispatchEvent(new Event('input', { bubbles: true }))
    })
    const create = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Crear una alternativa'))!
    act(() => create.click())
    expect(container.textContent).toContain('Armé una alternativa')
    expect(container.textContent).toContain('Quiero mostrar mis postres y recibir reservas')
    expect(container.querySelectorAll('.preview-block-row')).toHaveLength(4)
  })

  it('adds a page component to the preview', () => {
    const select = container.querySelector<HTMLSelectElement>('#add-page-block')!
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')!.set!.call(select, 'weather')
      select.dispatchEvent(new Event('change', { bubbles: true }))
    })
    const add = container.querySelector<HTMLButtonElement>('[aria-label="Añadir elemento"]')!
    act(() => add.click())
    expect(container.textContent).toContain('Clima')
    expect(container.querySelectorAll('.preview-block-row')).toHaveLength(3)
  })

  it('uses the selected page actions when generating an alternative', () => {
    const reservation = [...container.querySelectorAll<HTMLInputElement>('.studio-features input')]
      .find((input) => input.parentElement?.textContent?.toLocaleLowerCase('es').includes('recibir consultas'))!
    act(() => reservation.click())
    const goal = container.querySelector<HTMLTextAreaElement>('textarea[placeholder*="quiero que las personas"]')!
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(goal, 'Quiero presentar mis productos')
      goal.dispatchEvent(new Event('input', { bubbles: true }))
    })
    const create = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Crear una alternativa'))!
    act(() => create.click())
    expect(container.textContent).toContain('Mostrar productos o imágenes')
    expect(container.querySelectorAll('.preview-block-row')).toHaveLength(3)
    expect(container.querySelector('.studio-preview-form')).toBeNull()
  })

  it('builds a safe standalone HTML preview from the current page draft', () => {
    const html = buildPreviewHtml({
      template: 'gourmet', goal: '', title: '<script>alert(1)</script>', subtitle: 'Una página de ejemplo', features: [],
      blocks: [{ id: 'hero', kind: 'hero', title: '<img src=x>', body: 'Texto & detalle' }],
    }, '#55d8e9')
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(html).toContain('Texto &amp; detalle')
    expect(html).not.toContain('<h1><script>')
    expect(html).toContain('lang="es"')
  })

  it('embeds the selected reference image in the downloadable page preview', () => {
    const html = buildPreviewHtml({
      template: 'gourmet', goal: '', title: 'Mi página', subtitle: 'Una vista previa', features: [], blocks: [],
    }, '#55d8e9', { dataUrl: 'data:image/png;base64,aGVsbG8=', name: 'foto & logo.png' })
    expect(html).toContain('src="data:image/png;base64,aGVsbG8="')
    expect(html).toContain('alt="Imagen de referencia: foto &amp; logo.png"')
    expect(html).toContain('class="reference-image"')
  })

  it('saves the draft and downloads a standalone HTML preview', () => {
    const originalCreate = Object.getOwnPropertyDescriptor(URL, 'createObjectURL')
    const originalRevoke = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL')
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:studio-preview') })
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() })
    let downloadedName = ''
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      downloadedName = this.download
    })
    const save = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Guardar y descargar'))!
    act(() => save.click())
    expect(window.localStorage.getItem('portfolio-studio-page-v1')).not.toBeNull()
    expect(downloadedName).toBe('una-experiencia-para-saborear-vista-previa.html')
    expect(container.textContent).toContain('Descarga lista')
    vi.restoreAllMocks()
    if (originalCreate) Object.defineProperty(URL, 'createObjectURL', originalCreate)
    else Reflect.deleteProperty(URL, 'createObjectURL')
    if (originalRevoke) Object.defineProperty(URL, 'revokeObjectURL', originalRevoke)
    else Reflect.deleteProperty(URL, 'revokeObjectURL')
  })

  it('simulates an automation and explains that no external action ran', () => {
    const tab = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Automatizaciones'))!
    act(() => tab.click())
    const run = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Probar proceso'))!
    act(() => run.click())
    expect(container.textContent).toContain('Simulación completada: se recorrieron 2 pasos')
    expect(container.textContent).toContain('No se enviaron correos ni se activaron servicios externos')
  })

  it('saves the automation draft in local browser storage', () => {
    const tab = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Automatizaciones'))!
    act(() => tab.click())
    const save = [...container.querySelectorAll('button')].find((button) => button.textContent?.trim() === 'Guardar')!
    act(() => save.click())
    expect(window.localStorage.getItem('portfolio-studio-automation-v1')).not.toBeNull()
  })
})
