import { useEffect, useRef, useState, type CSSProperties, type ChangeEvent } from 'react'
import {
  ArrowDown, ArrowUp, Bell, Check, ChevronDown, ChevronUp, Clock3, Download,
  CloudSun, Eye, FileImage, FormInput, Gauge, Layers3, Plus, Save,
  Sparkles, Trash2, Workflow, Zap,
} from 'lucide-react'
import './studio.css'

type StudioTab = 'page' | 'automation'
type TemplateId = 'gourmet' | 'service' | 'event' | 'store'
type BlockKind = 'hero' | 'feature' | 'form' | 'alert' | 'weather' | 'updates' | 'container' | 'gallery' | 'products'
type PageBlock = { id: string; kind: BlockKind; title: string; body: string }
type PageFeature = 'gallery' | 'form' | 'alert' | 'weather' | 'updates' | 'container' | 'products'
type PageDraft = { template: TemplateId; goal: string; title: string; subtitle: string; features: PageFeature[]; blocks: PageBlock[] }
type FlowStep = { id: string; kind: string; title: string }
type AutomationDraft = { name: string; trigger: string; steps: FlowStep[] }

const pageStorageKey = 'portfolio-studio-page-v1'
const automationStorageKey = 'portfolio-studio-automation-v1'

const templates: Record<TemplateId, { name: string; headline: string; subtitle: string; blocks: Omit<PageBlock, 'id'>[] }> = {
  gourmet: {
    name: 'Gourmet',
    headline: 'Una experiencia para saborear',
    subtitle: 'Una página cálida para presentar tu propuesta, mostrar lo que ofreces y facilitar reservas.',
    blocks: [
      { kind: 'hero', title: 'Bienvenidos a la mesa', body: 'Una presentación breve para contar qué hace especial tu negocio.' },
      { kind: 'feature', title: 'Una propuesta especial', body: 'Explica con claridad por qué alguien elegiría tu propuesta.' },
    ],
  },
  service: {
    name: 'Servicios',
    headline: 'Tu próximo paso, más sencillo',
    subtitle: 'Explica tu servicio con claridad y ayuda a las personas a saber qué hacer después.',
    blocks: [
      { kind: 'hero', title: '¿Qué necesitas resolver?', body: 'Una introducción sencilla sobre el servicio.' },
      { kind: 'feature', title: 'Cómo podemos ayudarte', body: 'Describe el beneficio principal en palabras cotidianas.' },
    ],
  },
  event: {
    name: 'Eventos',
    headline: 'Una cita para recordar',
    subtitle: 'Reúne la información importante y facilita la confirmación de asistencia.',
    blocks: [
      { kind: 'hero', title: 'Guarda la fecha', body: 'Presenta el evento y explica por qué vale la pena asistir.' },
      { kind: 'feature', title: 'Una experiencia para recordar', body: 'Presenta el valor principal de asistir.' },
    ],
  },
  store: {
    name: 'Tienda / E-commerce',
    headline: 'Productos que vale la pena descubrir',
    subtitle: 'Presenta tu catálogo, destaca tus productos y muestra un recorrido de compra para tus clientes.',
    blocks: [
      { kind: 'hero', title: 'Encuentra tu próximo favorito', body: 'Explora una selección de productos pensada para ti.' },
      { kind: 'products', title: 'Productos destacados', body: 'Una muestra de catálogo con precios y carrito ilustrativo.' },
    ],
  },
}

const blockOptions: { kind: BlockKind; label: string; icon: typeof Bell; body: string }[] = [
  { kind: 'feature', label: 'Texto o beneficio', icon: Sparkles, body: 'Explica una idea o beneficio en palabras sencillas.' },
  { kind: 'form', label: 'Formulario', icon: FormInput, body: 'Una vista previa de los datos que podría solicitar.' },
  { kind: 'alert', label: 'Aviso', icon: Bell, body: 'Un mensaje importante para tus visitantes.' },
  { kind: 'weather', label: 'Clima', icon: CloudSun, body: 'Widget de ejemplo. Para datos reales se requiere configurar un proveedor.' },
  { kind: 'updates', label: 'Actualizaciones', icon: Clock3, body: 'Un bloque de novedades. La actualización en vivo requiere un servicio conectado.' },
  { kind: 'container', label: 'Contenedor', icon: Layers3, body: 'Agrupa información relacionada en una sección.' },
  { kind: 'gallery', label: 'Galería', icon: FileImage, body: 'Espacio para organizar imágenes de tu proyecto.' },
  { kind: 'products', label: 'Catálogo de productos', icon: Layers3, body: 'Productos, precios y botones de carrito para ilustrar una tienda.' },
]

const flowActionOptions = [
  { kind: 'alert', title: 'Mostrar una alerta' },
  { kind: 'email', title: 'Preparar un correo' },
  { kind: 'summary', title: 'Crear un resumen' },
  { kind: 'update', title: 'Actualizar contenido' },
]

const improvementOptions = [
  'Que sea más fácil de entender',
  'Que las personas puedan reservar o preguntar',
  'Que se vean mejor los productos',
  'Que funcione bien en el celular',
]

const defaultFeatures: Record<TemplateId, PageFeature[]> = {
  gourmet: ['gallery', 'form'],
  service: ['form', 'updates'],
  event: ['form', 'updates'],
  store: ['products', 'form'],
}

const featureChoices: { id: PageFeature; label: string; title: string; body: string }[] = [
  { id: 'gallery', label: 'Mostrar productos o imágenes', title: 'Lo más destacado', body: 'Un espacio para presentar productos, trabajos o momentos.' },
  { id: 'form', label: 'Recibir consultas o reservas', title: 'Hablemos de lo que necesitas', body: 'Un formulario de ejemplo para recoger una solicitud.' },
  { id: 'alert', label: 'Publicar un aviso importante', title: 'Un aviso para tus visitantes', body: 'Aquí puedes destacar una novedad, promoción o información útil.' },
  { id: 'weather', label: 'Mostrar clima', title: 'Clima de hoy', body: 'Widget de muestra. Para mostrar el clima real hay que conectar un proveedor.' },
  { id: 'updates', label: 'Mostrar novedades recientes', title: 'Novedades', body: 'Un espacio para compartir cambios y noticias.' },
  { id: 'container', label: 'Agrupar contenido en secciones', title: 'Información organizada', body: 'Una sección flexible para agrupar contenido relacionado.' },
  { id: 'products', label: 'Mostrar catálogo y precios', title: 'Productos destacados', body: 'Presenta tus productos con precios y un carrito de demostración.' },
]

const defaultAutomation: AutomationDraft = {
  name: 'Responder una solicitud',
  trigger: 'Cuando alguien envía un formulario',
  steps: [
    { id: 'step-welcome', kind: 'email', title: 'Preparar una respuesta de bienvenida' },
    { id: 'step-alert', kind: 'alert', title: 'Avisarme que llegó una solicitud' },
  ],
}

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `item-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function readDraft<T,>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key)
    return value ? { ...fallback, ...JSON.parse(value) } : fallback
  } catch {
    return fallback
  }
}

function blockFrom(kind: BlockKind): PageBlock {
  const option = blockOptions.find((item) => item.kind === kind)
  return { id: makeId(), kind, title: option?.label ?? 'Nuevo bloque', body: option?.body ?? '' }
}

function moveItem<T,>(items: T[], index: number, direction: -1 | 1) {
  const destination = index + direction
  if (destination < 0 || destination >= items.length) return items
  const next = [...items]
  ;[next[index], next[destination]] = [next[destination], next[index]]
  return next
}

function escapeHtml(value: string) {
  const replacements: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }
  return value.replace(/[&<>"']/g, (character) => replacements[character] ?? character)
}

function filenameFromTitle(title: string) {
  return title.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'mi-pagina'
}

function headlineFromGoal(goal: string, fallback: string) {
  const concise = goal.trim()
    .replace(/^(quiero|necesito|busco|me gustaría)\s+/i, '')
    .replace(/^(crear|hacer|diseñar|construir)\s+/i, '')
    .replace(/[.!?]+$/, '')
    .trim()
  if (!concise) return fallback
  if (concise.length <= 64) return concise.charAt(0).toLocaleUpperCase('es') + concise.slice(1)
  const shortened = concise.slice(0, 61).replace(/\s+\S*$/, '')
  return `${shortened}…`
}

export function buildPreviewHtml(draft: PageDraft, accent: string, reference?: { dataUrl: string; name: string } | null) {
  const safeAccent = /^#[\da-f]{6}$/i.test(accent) ? accent : '#55d8e9'
  const safeReferenceUrl = reference?.dataUrl.match(/^data:image\/(?:png|jpeg|gif|webp);base64,[\da-z+/]+=*$/i)?.[0]
  const referenceMarkup = safeReferenceUrl
    ? `<figure class="reference-image"><img src="${safeReferenceUrl}" alt="Imagen de referencia: ${escapeHtml(reference.name)}"><figcaption>Imagen de referencia</figcaption></figure>`
    : ''
  const content = draft.blocks.map((block) => {
    const title = escapeHtml(block.title)
    const body = escapeHtml(block.body)
    if (block.kind === 'form') return `<section class="form-card" id="contacto"><span class="eyebrow">HABLEMOS</span><h2>${title}</h2><p>${body}</p><form class="demo-form"><label>Nombre<input name="nombre" required placeholder="Tu nombre"></label><label>Correo electrónico<input name="correo" type="email" required placeholder="tu@correo.com"></label><label>¿En qué podemos ayudarte?<textarea name="mensaje" required rows="3" placeholder="Escribe aquí"></textarea></label><button type="submit">Enviar solicitud</button><p class="form-result" role="status"></p></form></section>`
    if (block.kind === 'weather') return `<section class="info-card weather"><span class="eyebrow">VISTA DE EJEMPLO</span><h2>${title}</h2><p>${body}</p><strong>22° · Clima ilustrativo</strong></section>`
    if (block.kind === 'updates') return `<section class="info-card"><span class="eyebrow">NOVEDADES</span><h2>${title}</h2><p>${body}</p><small>Actualización de muestra</small></section>`
    if (block.kind === 'gallery') return `<section class="info-card"><span class="eyebrow">GALERÍA DE EJEMPLO</span><h2>${title}</h2><p>${body}</p><div class="gallery-placeholders"><span>Imagen de ejemplo</span><span>Imagen de ejemplo</span><span>Imagen de ejemplo</span></div></section>`
    if (block.kind === 'products') return `<section class="info-card" id="productos"><span class="eyebrow">CATÁLOGO DE EJEMPLO</span><h2>${title}</h2><p>${body}</p><div class="product-grid"><article><div class="product-art">✦</div><h3>Producto destacado</h3><p>Descripción breve del producto.</p><strong>$ 89.000</strong><button type="button" class="add-cart">Agregar al carrito</button></article><article><div class="product-art">◈</div><h3>Favorito de clientes</h3><p>Calidad y diseño para tu día.</p><strong>$ 125.000</strong><button type="button" class="add-cart">Agregar al carrito</button></article><article><div class="product-art">✧</div><h3>Nueva colección</h3><p>Una opción especial para regalar.</p><strong>$ 64.000</strong><button type="button" class="add-cart">Agregar al carrito</button></article></div><p class="cart-status" role="status">Carrito de demostración: 0 productos</p></section>`
    if (block.kind === 'alert') return `<section class="info-card notice"><span class="eyebrow">AVISO</span><h2>${title}</h2><p>${body}</p></section>`
    return `<section class="info-card"><span class="eyebrow">${block.kind === 'hero' ? 'PRESENTACIÓN' : 'INFORMACIÓN'}</span><h2>${title}</h2><p>${body}</p></section>`
  }).join('\n')
  return `<!doctype html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f7f5ef"><title>${escapeHtml(draft.title)}</title>
<style>
:root{--accent:${safeAccent};--ink:#24342c;--muted:#65736b;--paper:#f7f5ef;--card:#fff}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.6}header{display:flex;justify-content:space-between;align-items:center;padding:15px max(22px,calc((100vw - 900px)/2));background:#fff;border-bottom:1px solid #e9e7df}header strong{font-size:13px;letter-spacing:.06em}header a{color:var(--ink);text-decoration:none;font-size:12px}.hero{padding:72px 24px 52px;text-align:center;background:linear-gradient(140deg,color-mix(in srgb,var(--accent) 16%,white),#fff 75%)}.hero small,.eyebrow{color:#738079;font-size:10px;letter-spacing:.12em;text-transform:uppercase}.hero h1{max-width:760px;margin:12px auto;font-size:clamp(34px,7vw,64px);line-height:1.05;letter-spacing:-.05em}.hero p{max-width:600px;margin:0 auto;color:var(--muted);font-size:15px}.hero .cta{display:inline-block;margin-top:22px;padding:11px 17px;background:var(--accent);border-radius:7px;color:#12231f;text-decoration:none;font-size:12px;font-weight:700}.content{display:grid;gap:15px;width:min(860px,calc(100% - 32px));margin:25px auto 60px}.info-card,.form-card{padding:23px;background:var(--card);border:1px solid #e6e6df;border-radius:10px}.info-card h2,.form-card h2{margin:5px 0;color:#24342c;font-size:21px;letter-spacing:-.03em}.info-card p,.form-card>p{margin:3px 0;color:var(--muted);font-size:13px}.info-card small{display:inline-block;margin-top:10px;color:#728078}.notice{border-left:4px solid var(--accent)}.weather strong{display:block;margin-top:13px;font-size:18px}.gallery-placeholders{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}.gallery-placeholders span{display:grid;min-height:100px;place-items:center;background:color-mix(in srgb,var(--accent) 18%,white);border-radius:7px;color:#55645b;font-size:11px}.reference-image{width:min(720px,calc(100% - 32px));margin:28px auto 0}.reference-image img{display:block;width:100%;max-height:360px;object-fit:cover;border:1px solid #e6e6df;border-radius:10px}.reference-image figcaption{margin-top:5px;color:#778178;text-align:right;font-size:10px}.form-card form{display:grid;gap:11px;margin-top:16px}.form-card label{display:grid;gap:5px;color:#46544b;font-size:11px}.form-card input,.form-card textarea{width:100%;padding:10px;border:1px solid #d8ded9;border-radius:5px;font:inherit;font-size:12px}.form-card button{justify-self:start;padding:10px 15px;border:0;border-radius:5px;background:var(--accent);color:#13251f;font-weight:700;cursor:pointer}.form-result{min-height:20px;color:#57685d;font-size:12px}.preview-note{padding:15px;color:#778178;text-align:center;font-size:10px}footer{padding:20px;text-align:center;color:#7d877f;border-top:1px solid #e5e4dd;font-size:10px}@media(max-width:600px){.hero{padding:48px 18px 38px}.hero p{font-size:13px}.info-card,.form-card{padding:17px}.gallery-placeholders{grid-template-columns:1fr 1fr}.gallery-placeholders span:last-child{display:none}.reference-image{margin-top:19px}}
</style><style>.product-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px}.product-grid article{padding:14px;background:#fff;border:1px solid #e6e6df;border-radius:8px}.product-art{display:grid;min-height:90px;place-items:center;background:color-mix(in srgb,var(--accent) 20%,white);border-radius:6px;color:#35534b;font-size:32px}.product-grid h3{margin:12px 0 3px;font-size:15px}.product-grid article p{font-size:12px}.product-grid strong{display:block;margin:10px 0}.add-cart{padding:9px 12px;background:var(--accent);border:0;border-radius:5px;color:#13251f;font-weight:700;cursor:pointer}.cart-status{margin-top:12px;padding:9px;background:color-mix(in srgb,var(--accent) 16%,white);border-radius:5px;font-weight:600}@media(max-width:600px){.product-grid{grid-template-columns:1fr}}</style></head><body><header><strong>${escapeHtml(templates[draft.template].name.toLocaleUpperCase('es'))}</strong><a href="#contenido">Ver la propuesta ↓</a></header><section class="hero"><small>UNA ALTERNATIVA PARA TU IDEA</small><h1>${escapeHtml(draft.title)}</h1><p>${escapeHtml(draft.subtitle)}</p><a class="cta" href="#contenido">Descubrir la propuesta</a></section>${referenceMarkup}<main class="content" id="contenido">${content}<p class="preview-note">Vista previa descargada. Formularios, clima, novedades y carrito son demostrativos; esta página no procesa pagos ni está publicada.</p></main><footer>Creada con Studio · Vista previa</footer><script>document.querySelectorAll('.demo-form').forEach(function(form){form.addEventListener('submit',function(event){event.preventDefault();form.querySelector('.form-result').textContent='Esta es una vista previa: no se envió información.';});});var cart=0;document.querySelectorAll('.add-cart').forEach(function(button){button.addEventListener('click',function(){cart++;document.querySelectorAll('.cart-status').forEach(function(status){status.textContent='Carrito de demostración: '+cart+' producto'+(cart===1?'':'s');});});});</script></body></html>`
}

function BlockPreview({ block }: { block: PageBlock }) {
  const [formStatus, setFormStatus] = useState('')
  const icon = blockOptions.find((option) => option.kind === block.kind)?.icon ?? Sparkles
  const Icon = icon
  if (block.kind === 'hero') return <div className="studio-preview-hero"><span>SECCIÓN PRINCIPAL</span><h2>{block.title}</h2><p>{block.body}</p><button type="button" onClick={() => document.getElementById('studio-preview-content')?.scrollIntoView({ behavior: 'smooth' })}>Conocer más <ArrowDown size={14} /></button></div>
  if (block.kind === 'form') return <form className="studio-preview-form" onSubmit={(event) => { event.preventDefault(); setFormStatus('Solicitud de muestra lista. No se envió información.') }}><div><FormInput size={18} /><h3>{block.title}</h3></div><p>{block.body}</p><label>Tu nombre<input required placeholder="Escribe aquí" /></label><label>Correo electrónico<input type="email" required placeholder="nombre@correo.com" /></label><button type="submit">Probar formulario</button>{formStatus && <p role="status">{formStatus}</p>}</form>
  if (block.kind === 'products') return <div className="studio-preview-products"><h3>{block.title}</h3><p>{block.body}</p><div className="studio-product-cards">{[['Producto destacado', '$89.000'], ['Favorito de clientes', '$125.000'], ['Nueva colección', '$64.000']].map(([name, price]) => <article key={name}><span className="studio-product-art">✦</span><b>{name}</b><strong>{price}</strong><button type="button" onClick={(event) => { const button = event.currentTarget; button.textContent = 'Añadido ✓'; window.setTimeout(() => { button.textContent = 'Agregar' }, 1200) }}>Agregar</button></article>)}</div><small>Carrito demostrativo · sin pagos</small></div>
  return <div className={`studio-preview-block preview-${block.kind}`}><span className="preview-block-icon"><Icon size={17} /></span><div><h3>{block.title}</h3><p>{block.body}</p>{block.kind === 'weather' && <strong><CloudSun size={15} /> 22° · Ejemplo</strong>}{block.kind === 'updates' && <small><i /> Actualización de muestra · hace 2 min</small>}</div></div>
}

export default function Studio() {
  const [tab, setTab] = useState<StudioTab>('page')
  const [draft, setDraft] = useState<PageDraft>(() => readDraft(pageStorageKey, {
    template: 'gourmet', goal: '', title: templates.gourmet.headline, subtitle: templates.gourmet.subtitle, features: defaultFeatures.gourmet,
    blocks: templates.gourmet.blocks.map((block) => ({ ...block, id: makeId() })),
  }))
  const [automation, setAutomation] = useState<AutomationDraft>(() => readDraft(automationStorageKey, defaultAutomation))
  const [newBlockKind, setNewBlockKind] = useState<BlockKind>('alert')
  const [newActionKind, setNewActionKind] = useState('summary')
  const [improvement, setImprovement] = useState(improvementOptions[0])
  const [reference, setReference] = useState<{ url: string; name: string; dataUrl: string } | null>(null)
  const [ideaStatus, setIdeaStatus] = useState('')
  const [saveStatus, setSaveStatus] = useState('')
  const [runStatus, setRunStatus] = useState('')
  const [runStep, setRunStep] = useState(-1)
  const [accent, setAccent] = useState('#55d8e9')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => () => { if (reference?.url) URL.revokeObjectURL(reference.url) }, [reference])

  function changeTemplate(value: TemplateId) {
    const template = templates[value]
    setDraft((current) => ({
      ...current,
      template: value,
      title: template.headline,
      subtitle: template.subtitle,
      features: defaultFeatures[value],
      blocks: template.blocks.map((block) => ({ ...block, id: makeId() })),
    }))
    setSaveStatus('')
  }

  async function onReferenceSelected(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type)) {
      setIdeaStatus('Elige una imagen JPG, PNG, GIF o WebP.')
      input.value = ''
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setIdeaStatus('La imagen debe pesar menos de 8 MB.')
      input.value = ''
      return
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('No se pudo leer la imagen.'))
      reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer la imagen.'))
      reader.readAsDataURL(file)
    }).catch(() => '')
    if (!dataUrl) {
      setIdeaStatus('No se pudo leer la imagen. Prueba con otra imagen PNG, JPG, GIF o WebP.')
      event.target.value = ''
      return
    }
    setReference({ url: URL.createObjectURL(file), name: file.name, dataUrl })
    setIdeaStatus('La imagen se incluirá en la visualización descargada. No se ha enviado a ningún servicio.')
  }

  function createAlternative() {
    if (!draft.goal.trim()) {
      setIdeaStatus('Cuéntame primero qué necesita lograr la página. Puedes explicarlo con tus propias palabras.')
      return
    }
    const template = templates[draft.template]
    const plainGoal = draft.goal.trim().replace(/[.!?]+$/, '')
    const headline = headlineFromGoal(plainGoal, template.headline)
    const baseBlocks = template.blocks.map((block, index) => ({
      ...block,
      id: makeId(),
      ...(index === 0 ? { title: headline, body: `Propuesta para: ${plainGoal}. ${template.subtitle}` } : { body: `Prioridad: ${improvement.toLocaleLowerCase('es')}. ${plainGoal}.` }),
    }))
    const featureBlocks = draft.features.filter((feature) => !(draft.template === 'store' && feature === 'products')).map((feature) => {
      const definition = featureChoices.find((item) => item.id === feature)!
      const title = feature === 'form'
        ? draft.template === 'gourmet' ? 'Reservar o hacer una pregunta' : draft.template === 'event' ? 'Confirmar asistencia' : 'Solicitar información'
        : definition.title
      return { ...blockFrom(feature), title, body: definition.body }
    })
    setDraft((current) => ({ ...current, title: headline, subtitle: `Una alternativa pensada para ${improvement.toLocaleLowerCase('es')}. Objetivo: ${plainGoal}.`, blocks: [...baseBlocks, ...featureBlocks] }))
    setIdeaStatus(`Armé una alternativa con ${draft.features.length} opciones: ${draft.features.map((feature) => featureChoices.find((item) => item.id === feature)?.label.toLocaleLowerCase('es')).join(', ') || 'una presentación sencilla'}. Puedes editarla. La imagen sirve de referencia visual; esta versión no la interpreta con IA.`)
    setSaveStatus('')
  }

  function savePage() {
    try {
      window.localStorage.setItem(pageStorageKey, JSON.stringify(draft))
      const blob = new Blob([buildPreviewHtml(draft, accent, reference)], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filenameFromTitle(draft.title)}-vista-previa.html`
      document.body.append(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setSaveStatus(`Descarga lista: ${link.download}. Ábrelo desde Descargas para ver la página${reference ? ' con la imagen de referencia' : ''}.`)
    } catch {
      setSaveStatus('No pude guardar el borrador en este navegador.')
    }
  }

  function saveAutomation() {
    try {
      window.localStorage.setItem(automationStorageKey, JSON.stringify(automation))
      setSaveStatus('Automatización guardada en este navegador.')
    } catch {
      setSaveStatus('No pude guardar la automatización en este navegador.')
    }
  }

  function addAutomationStep() {
    const option = flowActionOptions.find((item) => item.kind === newActionKind) ?? flowActionOptions[0]
    setAutomation((current) => ({ ...current, steps: [...current.steps, { id: makeId(), kind: option.kind, title: option.title }] }))
    setRunStatus('')
  }

  function simulateAutomation() {
    if (!automation.steps.length) {
      setRunStatus('Añade al menos un paso para probar el flujo.')
      return
    }
    setRunStep(automation.steps.length - 1)
    setRunStatus(`Simulación completada: se recorrieron ${automation.steps.length} pasos. No se enviaron correos ni se activaron servicios externos.`)
  }

  const previewStyle = { '--studio-accent': accent } as CSSProperties

  return (
    <section className="studio-section" id="creador">
      <div className="section-wrap">
        <div className="section-heading studio-heading">
          <div><h2>Crea una solución <span>a tu manera.</span></h2><p>Cuéntanos qué quieres resolver; arma una página visual y organiza tareas automáticas sin escribir código.</p></div>
          <span className="studio-flag"><i /> PROTOTIPO INTERACTIVO</span>
        </div>

        <div className="studio-tabs" role="tablist" aria-label="Herramientas de Studio">
          <button role="tab" aria-selected={tab === 'page'} className={tab === 'page' ? 'active' : ''} onClick={() => { setTab('page'); setSaveStatus('') }}><Layers3 size={16} /> Crear una página</button>
          <button role="tab" aria-selected={tab === 'automation'} className={tab === 'automation' ? 'active' : ''} onClick={() => { setTab('automation'); setSaveStatus('') }}><Workflow size={16} /> Automatizaciones</button>
        </div>

        {tab === 'page' ? (
          <div className="studio-workspace" role="tabpanel">
            <aside className="studio-sidebar">
              <div className="studio-panel-heading"><span className="studio-step">01</span><div><b>Cuéntame tu idea</b><small>Usa palabras sencillas; no necesitas saber diseño.</small></div></div>
              <label className="studio-label">¿Qué tipo de página necesitas?
                <select value={draft.template} onChange={(event) => changeTemplate(event.target.value as TemplateId)}>
                  {Object.entries(templates).map(([id, template]) => <option key={id} value={id}>{template.name}</option>)}
                </select>
              </label>
              <label className="studio-label">¿Qué necesita lograr?
                <textarea value={draft.goal} onChange={(event) => setDraft((current) => ({ ...current, goal: event.target.value }))} rows={4} maxLength={500} placeholder="Ejemplo: quiero que las personas vean mis postres y puedan reservar una mesa." />
              </label>
              <div className="studio-label">¿Tienes una imagen de referencia?<span className="studio-hint">Súbela para tenerla a la vista mientras creas tu alternativa.</span></div>
              <input ref={fileInputRef} className="studio-file-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onReferenceSelected} />
              {reference ? <div className="reference-preview"><img src={reference.url} alt={`Referencia: ${reference.name}`} /><div><b>{reference.name}</b><small>Se incluye en la vista previa descargada</small></div><button type="button" aria-label="Quitar imagen de referencia" onClick={() => { setReference(null); if (fileInputRef.current) fileInputRef.current.value = '' }}>×</button></div> : <button type="button" className="reference-upload" onClick={() => fileInputRef.current?.click()}><FileImage size={18} /><span><b>Elegir imagen</b><small>PNG, JPG, WebP o GIF · máximo 8 MB</small></span><Plus size={16} /></button>}
              <div className="studio-label">¿Qué te gustaría mejorar primero?<span className="studio-hint">Elige la opción que más se acerque a lo que necesitas.</span></div>
              <div className="improvement-options" role="group" aria-label="Prioridad de la alternativa">{improvementOptions.map((option) => <button type="button" key={option} aria-pressed={improvement === option} onClick={() => setImprovement(option)}>{option}</button>)}</div>
              <fieldset className="studio-features"><legend>¿Qué quieres que pueda hacer la página?</legend><span className="studio-hint">Puedes elegir varias opciones.</span>{featureChoices.map((feature) => <label key={feature.id}><input type="checkbox" checked={draft.features.includes(feature.id)} onChange={(event) => setDraft((current) => ({ ...current, features: event.target.checked ? [...new Set([...current.features, feature.id])] : current.features.filter((item) => item !== feature.id) }))} /><span>{feature.label}</span></label>)}</fieldset>
              <div className="studio-privacy"><Eye size={15} /><span>La imagen se queda en este navegador. Este prototipo no la envía ni la interpreta con IA.</span></div>
              <button type="button" className="button button-primary studio-generate" onClick={createAlternative}><Sparkles size={16} /> Crear una alternativa</button>
              {ideaStatus && <p className="studio-status" role="status">{ideaStatus}</p>}
              <div className="studio-divider" />
              <div className="studio-panel-heading"><span className="studio-step">02</span><div><b>Personaliza el estilo</b><small>Elige un color para ver el cambio al instante.</small></div></div>
              <div className="palette-options" role="group" aria-label="Color principal">
                {[[ '#55d8e9', 'Cian'], ['#f3c874', 'Dorado'], ['#a997ff', 'Violeta'], ['#72d6a0', 'Esmeralda'], ['#ff8297', 'Coral'], ['#5c93ff', 'Azul'], ['#f08ad5', 'Rosa'], ['#f1f4f6', 'Claro']].map(([color, label]) => <button key={color} type="button" aria-label={`Usar color ${label}`} aria-pressed={accent === color} style={{ backgroundColor: color }} onClick={() => setAccent(color)} />)}
              </div>
            </aside>

            <div className="studio-canvas-wrap">
              <div className="studio-canvas-toolbar"><span><i /> Vista previa</span><label><span>Formato</span><select aria-label="Formato de vista previa" value={previewDevice} onChange={(event) => setPreviewDevice(event.target.value as 'desktop' | 'mobile')}><option value="desktop">Computador</option><option value="mobile">Móvil</option></select><ChevronDown size={13} /></label><button type="button" onClick={savePage}><Download size={15} /> Guardar y descargar</button></div>
              <div className={`studio-canvas ${previewDevice === 'mobile' ? 'studio-canvas-mobile' : ''}`} style={previewStyle}>
                <div className="studio-page-preview">
                  <div className="preview-topbar"><span className="preview-brand-dot" /><span>{draft.template === 'gourmet' ? 'CASA SABOR' : draft.template === 'event' ? 'EL ENCUENTRO' : draft.template === 'store' ? 'TU TIENDA' : 'TU PROYECTO'}</span><button type="button" onClick={() => document.getElementById('studio-preview-content')?.scrollIntoView({ behavior: 'smooth' })}>Ver página <ChevronDown size={12} /></button></div>
                  <div className="preview-page-title"><span>{templates[draft.template].name.toUpperCase()} · VISTA DE EJEMPLO</span><h2>{draft.title}</h2><p>{draft.subtitle}</p></div>
                  {reference && <figure className="studio-reference-visual"><img src={reference.url} alt={`Referencia visual: ${reference.name}`} /><figcaption>IMAGEN DE REFERENCIA</figcaption></figure>}
                  <div className="preview-content-blocks" id="studio-preview-content">{draft.blocks.map((block, index) => <div className="preview-block-row" key={block.id}><BlockPreview block={block} /><div className="preview-block-tools"><button type="button" aria-label={`Mover ${block.title} arriba`} disabled={index === 0} onClick={() => setDraft((current) => ({ ...current, blocks: moveItem(current.blocks, index, -1) }))}><ChevronUp size={14} /></button><button type="button" aria-label={`Mover ${block.title} abajo`} disabled={index === draft.blocks.length - 1} onClick={() => setDraft((current) => ({ ...current, blocks: moveItem(current.blocks, index, 1) }))}><ChevronDown size={14} /></button></div></div>)}</div>
                  <div className="preview-add-row"><label htmlFor="add-page-block">Añadir a tu página</label><select id="add-page-block" value={newBlockKind} onChange={(event) => setNewBlockKind(event.target.value as BlockKind)}>{blockOptions.map((option) => <option key={option.kind} value={option.kind}>{option.label}</option>)}</select><button type="button" aria-label="Añadir elemento" onClick={() => setDraft((current) => ({ ...current, blocks: [...current.blocks, blockFrom(newBlockKind)] }))}><Plus size={15} /> Añadir</button></div>
                </div>
              </div>
              <div className="studio-canvas-foot"><span><Eye size={14} /> Solo vista previa; el formulario no envía información.</span>{saveStatus && <span className="studio-saved" role="status"><Check size={14} /> {saveStatus}</span>}</div>
            </div>

            <aside className="studio-inspector">
              <div className="studio-panel-heading"><span className="studio-step">03</span><div><b>Edita los elementos</b><small>Selecciona el texto que quieres cambiar.</small></div></div>
              <label className="studio-label">Título de la página<input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} /></label>
              <label className="studio-label">Texto de presentación<textarea rows={3} value={draft.subtitle} onChange={(event) => setDraft((current) => ({ ...current, subtitle: event.target.value }))} /></label>
              <div className="inspector-divider" />
              <div className="inspector-subheading"><b>Contenido de la página</b><span>{draft.blocks.length} elementos</span></div>
              <div className="inspector-block-list">{draft.blocks.map((block, index) => <div className="inspector-block" key={block.id}><span className="block-order">{String(index + 1).padStart(2, '0')}</span><div className="inspector-block-fields"><input aria-label={`Título del elemento ${index + 1}`} value={block.title} onChange={(event) => setDraft((current) => ({ ...current, blocks: current.blocks.map((item) => item.id === block.id ? { ...item, title: event.target.value } : item) }))} /><textarea aria-label={`Descripción del elemento ${index + 1}`} rows={2} value={block.body} onChange={(event) => setDraft((current) => ({ ...current, blocks: current.blocks.map((item) => item.id === block.id ? { ...item, body: event.target.value } : item) }))} /><small>{blockOptions.find((option) => option.kind === block.kind)?.label ?? 'Presentación'}</small></div><button type="button" aria-label={`Eliminar ${block.title}`} className="remove-block" onClick={() => setDraft((current) => ({ ...current, blocks: current.blocks.filter((item) => item.id !== block.id) }))}><Trash2 size={14} /></button></div>)}</div>
              <p className="studio-inspector-note">Al guardar, se conserva un borrador local y se descarga un archivo HTML para abrir la vista previa.</p>
            </aside>
          </div>
        ) : (
          <div className="automation-workspace" role="tabpanel">
            <div className="automation-intro"><div><span className="studio-step">FLUJO VISUAL</span><h3>De una tarea repetitiva a un proceso claro.</h3><p>Elige qué inicia el proceso, añade pasos y prueba el recorrido. No necesitas escribir código.</p></div><span className="automation-safety"><Gauge size={15} /> Prueba segura</span></div>
            <div className="automation-builder">
              <div className="automation-flow-column">
                <label className="studio-label">Nombre del proceso<input value={automation.name} onChange={(event) => setAutomation((current) => ({ ...current, name: event.target.value }))} placeholder="Ejemplo: responder a una reserva" /></label>
                <div className="flow-node trigger-node"><span className="flow-node-icon"><Zap size={17} /></span><div><small>CUANDO OCURRA ESTO</small><select value={automation.trigger} onChange={(event) => setAutomation((current) => ({ ...current, trigger: event.target.value }))}><option>Cuando alguien envía un formulario</option><option>Cuando llega una fecha programada</option><option>Cuando se publica una actualización</option></select></div></div>
                <div className="flow-connector"><i /></div>
                {automation.steps.map((step, index) => <div className={`flow-step-card ${runStep >= index ? 'is-complete' : ''}`} key={step.id}><span className="flow-step-icon">{runStep >= index ? <Check size={16} /> : <span>{index + 1}</span>}</span><div className="flow-step-body"><small>ACCIÓN {String(index + 1).padStart(2, '0')}</small><input aria-label={`Nombre del paso ${index + 1}`} value={step.title} onChange={(event) => setAutomation((current) => ({ ...current, steps: current.steps.map((item) => item.id === step.id ? { ...item, title: event.target.value } : item) }))} /><select aria-label={`Tipo del paso ${index + 1}`} value={step.kind} onChange={(event) => { const option = flowActionOptions.find((item) => item.kind === event.target.value); setAutomation((current) => ({ ...current, steps: current.steps.map((item) => item.id === step.id ? { ...item, kind: event.target.value, title: option?.title ?? item.title } : item) })) }}>{flowActionOptions.map((option) => <option key={option.kind} value={option.kind}>{option.title}</option>)}</select></div><div className="flow-step-actions"><button type="button" aria-label="Mover paso arriba" disabled={index === 0} onClick={() => { setAutomation((current) => ({ ...current, steps: moveItem(current.steps, index, -1) })); setRunStep(-1) }}><ArrowUp size={14} /></button><button type="button" aria-label="Mover paso abajo" disabled={index === automation.steps.length - 1} onClick={() => { setAutomation((current) => ({ ...current, steps: moveItem(current.steps, index, 1) })); setRunStep(-1) }}><ArrowDown size={14} /></button><button type="button" aria-label={`Eliminar paso ${index + 1}`} onClick={() => { setAutomation((current) => ({ ...current, steps: current.steps.filter((item) => item.id !== step.id) })); setRunStep(-1) }}><Trash2 size={14} /></button></div></div>)}
                <div className="flow-connector"><i /></div>
                <div className="flow-add-step"><select aria-label="Acción para añadir" value={newActionKind} onChange={(event) => setNewActionKind(event.target.value)}>{flowActionOptions.map((option) => <option key={option.kind} value={option.kind}>{option.title}</option>)}</select><button type="button" onClick={addAutomationStep}><Plus size={15} /> Añadir paso</button></div>
                <div className="flow-end"><span><Check size={14} /></span> Proceso terminado</div>
              </div>
              <aside className="automation-summary"><span className="automation-summary-icon"><Workflow size={18} /></span><span className="section-eyebrow">RESUMEN DEL PROCESO</span><h4>{automation.name || 'Proceso sin nombre'}</h4><p>Se activa:</p><b>{automation.trigger.toLowerCase()}</b><p>Después realizará:</p><ol>{automation.steps.map((step) => <li key={step.id}>{step.title}</li>)}</ol><div className="automation-demo-note"><Bell size={14} /><span>Los correos, alertas y actualizaciones son solo una simulación local.</span></div><div className="automation-buttons"><button type="button" className="button button-secondary" onClick={saveAutomation}><Save size={14} /> Guardar</button><button type="button" className="button button-primary" onClick={simulateAutomation}><Zap size={14} /> Probar proceso</button></div>{(saveStatus || runStatus) && <p className="automation-status" role="status">{runStatus || saveStatus}</p>}</aside>
            </div>
          </div>
        )}
        <p className="studio-note"><Sparkles size={14} /> Las páginas y procesos se guardan únicamente en este navegador. Para publicar páginas, analizar imágenes con IA o ejecutar automatizaciones reales, habrá que conectar servicios seguros en el backend.</p>
      </div>
    </section>
  )
}
