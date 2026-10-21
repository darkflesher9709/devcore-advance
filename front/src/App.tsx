import { useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3,
  Check, ChevronDown, Code2, FileSpreadsheet, Layers3, Mail, Menu, Search,
  ShoppingCart, Sparkles, Workflow, X,
} from 'lucide-react'
import { categories, prototypes, technologies, type Project } from './projects'
import Studio from './Studio'
import Pricing from './Pricing'
import './inquiry.css'
import { publicAsset } from './assets'

type PageKey = 'inicio' | 'proyectos' | 'prototipos' | 'precios' | 'studio' | 'contacto'

function ProjectCardImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  return <>
    <img className="project-art-image-backdrop" src={src} alt="" aria-hidden="true" />
    <img className={`project-art-image-foreground ${className}`} src={src} alt={alt} />
  </>
}

function CrmBrandLogo() {
  return <ProjectCardImage className="crm-card-logo" src={publicAsset('/images/crm-beta-2-ai-logo.png')} alt="Logo de CRM Beta 2.0 IA: inteligencia artificial para gestión comercial" />
}

function CoreDeskBrandLogo() {
  return <ProjectCardImage className="core-desk-card-logo" src={publicAsset('/images/core-desk-logo.png')} alt="Logo de CORE DESK: soporte TI y gestión de tickets" />
}

function ProjectCard({ project, onOpen, onRequest }: { project: Project; onOpen: (project: Project) => void; onRequest: (project: Project) => void }) {
  const Icon = project.id === 'aoc' || project.id === 'golpred' ? BarChart3 : project.id === 'hoja-clara' ? Layers3 : project.id === 'excel-automation' ? FileSpreadsheet : Workflow
  return (
    <article className="project-card">
      <button className={`project-art art-${project.id}`} onClick={() => onOpen(project)} aria-label={`Ver detalle de ${project.name}`}>
        {project.id === 'golpred' && <img className="project-art-image-backdrop" src={publicAsset('/images/golpred-logo.png')} alt="" aria-hidden="true" />}
        {project.id === 'golpred' ? <div className="golpred-card-logo" aria-hidden="true"><img src={publicAsset('/images/golpred-logo.png')} alt="" /><span>Abrir software <ArrowUpRight size={12} /></span></div> : project.id !== 'aoc' && project.id !== 'crm' && project.id !== 'siigo-2' && project.id !== 'core-desk' && project.id !== 'lalas-magic-events' && project.id !== 'pozos-petronexus' && <span className="art-icon"><Icon size={25} /></span>}
        {project.id === 'aoc' && <div className="aoc-card-image-shell" aria-hidden="true"><img className="aoc-card-image aoc-card-backdrop" src={publicAsset('/images/aot-sentinel.png')} alt="" /><img className="aoc-card-image aoc-card-foreground" src={publicAsset('/images/aot-sentinel.png')} alt="" /></div>}
        {project.id === 'excel-automation' && <ProjectCardImage className="excel-card-image" src={publicAsset('/images/excel-process-logo.png')} alt="Excel Process: automatización y optimización de procesos" />}
        {project.id === 'crm' && <CrmBrandLogo />}
        {project.id === 'core-desk' && <CoreDeskBrandLogo />}
        {project.id === 'lalas-magic-events' && <ProjectCardImage className="lalas-events-card-image" src={publicAsset('/images/lalas-magic-events-home.png')} alt="Lala’s Magic Events: portada de la página de eventos" />}
        {project.id === 'pozos-petronexus' && <ProjectCardImage className="petronexus-card-image" src={publicAsset('/images/nexus-brand.png')} alt="Logo de NEXUS" />}
        {project.id === 'siigo-2' && <ProjectCardImage className="siigo-card-image" src={publicAsset('/images/siigo-facturix-ai-logo.svg')} alt="FACTURIX AI, facturador electrónico" />}
        {project.id === 'hoja-clara' && <div className="mini-sheet" aria-hidden="true"><span>Proceso</span><i /><i /><i /></div>}
      </button>
      <div className="project-content">
        <div className="project-meta"><span>{project.category}</span></div>
        <h3>{project.name}</h3>
        <p>{project.summary}</p>
        <div className="project-card-actions"><button className="text-link" onClick={() => onOpen(project)}>Explorar prototipo <ArrowUpRight size={16} /></button><button type="button" className="project-request-button" onClick={() => onRequest(project)} aria-label={`Solicitar información sobre ${project.name}`}><ShoppingCart size={16} /><span>Solicitar</span></button></div>
      </div>
    </article>
  )
}

type ReferenceScreenshot = { src: string; alt: string; title: string }

const crmScreenshots: ReferenceScreenshot[] = [
  { src: publicAsset('/images/crm-beta-2-ai-dashboard.png'), alt: 'CRM Beta 2.0 IA: panel de gestión comercial para construcción; datos demostrativos', title: '01 · Dashboard' },
  { src: publicAsset('/images/crm-beta-2-ai-clients.png'), alt: 'CRM Beta 2.0 IA: directorio de clientes de construcción; datos demostrativos', title: '02 · Clientes' },
  { src: publicAsset('/images/crm-beta-2-ai-opportunities.png'), alt: 'CRM Beta 2.0 IA: oportunidades comerciales de construcción; datos demostrativos', title: '03 · Oportunidades' },
  { src: publicAsset('/images/crm-beta-2-ai-quotes.png'), alt: 'CRM Beta 2.0 IA: cotizaciones de proyectos de construcción; datos demostrativos', title: '04 · Cotizaciones' },
  { src: publicAsset('/images/crm-beta-2-ai-followups.png'), alt: 'CRM Beta 2.0 IA: seguimientos y agenda comercial; datos demostrativos', title: '05 · Seguimientos' },
  { src: publicAsset('/images/crm-beta-2-ai-sales.png'), alt: 'CRM Beta 2.0 IA: ventas y proyectos de construcción; datos demostrativos', title: '06 · Ventas' },
  { src: publicAsset('/images/crm-beta-2-ai-postsale.png'), alt: 'CRM Beta 2.0 IA: seguimiento posventa de proyectos; datos demostrativos', title: '07 · Posventa' },
  { src: publicAsset('/images/crm-beta-2-ai-reports.png'), alt: 'CRM Beta 2.0 IA: reportes comerciales; datos demostrativos', title: '08 · Reportes' },
]

const siigoScreenshots: ReferenceScreenshot[] = [
  { src: publicAsset('/images/siigo-facturix-dashboard.png'), alt: 'Facturador electrónico: resumen ejecutivo financiero con datos demostrativos', title: '01 · Resumen ejecutivo' },
  { src: publicAsset('/images/siigo-facturix-sales.png'), alt: 'Facturador electrónico: módulo de ventas y documentos comerciales', title: '02 · Ventas' },
  { src: publicAsset('/images/siigo-facturix-electronic-invoicing.png'), alt: 'FACTURIX AI: preparación y validación de factura electrónica en demo', title: '03 · Facturación electrónica' },
  { src: publicAsset('/images/siigo-facturix-purchases.png'), alt: 'Facturador electrónico: módulo de compras y proveedores', title: '04 · Compras' },
  { src: publicAsset('/images/siigo-facturix-inventory.png'), alt: 'Facturador electrónico: inventario y alertas de stock de muestra', title: '05 · Inventario' },
  { src: publicAsset('/images/siigo-facturix-customer-followup.png'), alt: 'Facturador electrónico: seguimiento e indicadores de clientes de demostración', title: '06 · Seguimiento de clientes' },
]

const coreDeskScreenshots: ReferenceScreenshot[] = [
  { src: publicAsset('/images/core-desk-login.png'), alt: 'CORE DESK: pantalla de acceso al sistema de soporte', title: '01 · Acceso' },
  { src: publicAsset('/images/core-desk-command-center.png'), alt: 'CORE DESK: panel de control con tickets, SLA y metas de soporte', title: '02 · Centro de control' },
  { src: publicAsset('/images/core-desk-ticket-control.png'), alt: 'CORE DESK: seguimiento de técnicos y tickets por prioridad y estado', title: '03 · Seguimiento de tickets' },
]

const lalasEventsScreenshots: ReferenceScreenshot[] = [
  { src: publicAsset('/images/lalas-magic-events-home.png'), alt: 'Lala’s Magic Events: página principal y portada de celebración', title: '01 · Página principal' },
  { src: publicAsset('/images/lalas-magic-events-services.png'), alt: 'Lala’s Magic Events: servicios de eventos sociales y corporativos', title: '02 · Servicios' },
  { src: publicAsset('/images/lalas-magic-events-gallery.png'), alt: 'Lala’s Magic Events: galería de montajes y celebraciones', title: '03 · Galería de eventos' },
]

const oilintelligenceScreenshots: ReferenceScreenshot[] = [
  { src: publicAsset('/images/nexus-login.png'), alt: 'NEXUS: acceso a la consola de análisis', title: '01 · Acceso a la plataforma' },
  { src: publicAsset('/images/nexus-primary-analysis.png'), alt: 'NEXUS: análisis primario y calidad de datos', title: '02 · Análisis primario' },
  { src: publicAsset('/images/oilintelligence-secondary-analysis.png'), alt: 'NEXUS: análisis secundario por bloque y formación', title: '03 · Análisis secundario' },
  { src: publicAsset('/images/oilintelligence-pressure-analysis.png'), alt: 'NEXUS: indicadores y registros operativos', title: '04 · Indicadores operativos' },
  { src: publicAsset('/images/oilintelligence-hmpl-console.png'), alt: 'NEXUS: consola modular de datos y modelos operativos', title: '05 · Consola de modelos' },
]

function ReferenceGallery({ label, images }: { label: string; images: ReferenceScreenshot[] }) {
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string; title: string } | null>(null)
  useEffect(() => {
    if (!expandedImage) return
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setExpandedImage(null)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [expandedImage])

  return <>
    <div className="software-reference-gallery" aria-label={label}>{images.map((image) => <figure key={image.src}><button type="button" className="aoc-reference-open" onClick={() => setExpandedImage(image)} aria-label={`Ampliar ${image.title}`}><img src={image.src} alt={image.alt} /></button><figcaption>{image.title}</figcaption></figure>)}</div>
    {expandedImage && <div className="aoc-lightbox-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setExpandedImage(null) }}><section className="aoc-lightbox" role="dialog" aria-modal="true" aria-label={`Vista ampliada: ${expandedImage.title}`}><div className="aoc-lightbox-toolbar"><span>{expandedImage.title}</span><button type="button" className="aoc-lightbox-cancel" onClick={() => setExpandedImage(null)}>Cancelar <X size={15} /></button></div><img src={expandedImage.src} alt={expandedImage.alt} /></section></div>}
  </>
}

function AocDashboard() {
  const [symbol, setSymbol] = useState('XAU/USD')
  const [timeframe, setTimeframe] = useState('15m')
  const quotes: Record<string, string> = { 'XAU/USD': '2,431.25', 'EUR/USD': '1.0842', 'BTC/USD': '64,280.00' }
  const candles = [
    [63, 55, 48, 72], [55, 61, 51, 68], [61, 51, 45, 66], [51, 57, 47, 63], [57, 43, 38, 61],
    [43, 47, 39, 53], [47, 34, 29, 51], [34, 39, 30, 46], [39, 25, 20, 43], [25, 31, 22, 38],
    [31, 18, 13, 35], [18, 22, 14, 28], [22, 12, 8, 27], [12, 16, 9, 22], [16, 9, 5, 20],
  ]
  return <section className="aoc-dashboard" aria-label="Demostración del panel AOT">
    <div className="aoc-dashboard-top"><div><span className="aoc-eyebrow">AOT · VISUAL MARKET DESK</span><h3>Panel de mercado</h3></div><span className="aoc-demo-badge"><i /> Solo observación · Demo</span></div>
    <div className="aoc-controls"><label>Activo<select aria-label="Activo de demostración" value={symbol} onChange={(event) => setSymbol(event.target.value)}><option>XAU/USD</option><option>EUR/USD</option><option>BTC/USD</option></select></label><div className="aoc-timeframes" aria-label="Temporalidad de demostración">{['5m', '15m', '1h', '4h'].map((item) => <button type="button" className={timeframe === item ? 'selected' : ''} aria-pressed={timeframe === item} key={item} onClick={() => setTimeframe(item)}>{item}</button>)}</div><span className="aoc-live-label">DATOS SINTÉTICOS</span></div>
    <div className="aoc-session-grid">{[['Asia', 'Tokio', 'Activa'], ['Europa', 'Londres', 'Activa'], ['América', 'Nueva York', 'Próxima']].map(([region, city, status]) => <div className="aoc-session" key={region}><span>{region} · {city}</span><b>{status}</b></div>)}</div>
    <div className="aoc-chart-card"><div className="aoc-chart-heading"><div><span>{symbol} · {timeframe}</span><b>{quotes[symbol]}</b></div><span className="aoc-chart-disclaimer">Precio ficticio</span></div><svg className="aoc-candle-chart" viewBox="0 0 700 250" role="img" aria-label={`Gráfica sintética de velas para ${symbol}, temporalidad ${timeframe}`} preserveAspectRatio="none">
      {[35, 80, 125, 170, 215].map((y) => <line key={y} x1="0" y1={y} x2="700" y2={y} className="aoc-chart-gridline" />)}
      {candles.map(([open, close, high, low], i) => { const x = 23 + i * 45; const up = close < open; const color = up ? '#29c7a3' : '#f06170'; const top = Math.min(open, close) * 2.1; const height = Math.max(Math.abs(open - close) * 2.1, 5); return <g key={i} className={up ? 'aoc-candle-up' : 'aoc-candle-down'}><line x1={x + 9} y1={high * 2.1} x2={x + 9} y2={low * 2.1} stroke={color} strokeWidth="2"/><rect x={x} y={top} width="18" height={height} rx="1" fill={color}/><rect x={x} y={188 + (i * 17 % 44)} width="18" height={62 - (i * 17 % 44)} fill={color} opacity=".32"/></g>})}
    </svg><div className="aoc-chart-axis"><span>09:00</span><span>12:00</span><span>15:00</span><span>18:00</span><span>21:00</span></div></div>
    <div className="aoc-insight-grid"><article><span>ESCENARIO ILUSTRATIVO</span><b>Movimiento de muestra</b><p>Este panel no calcula ni anticipa precios reales.</p></article><article><span>REVISIÓN DE RIESGO</span><b>Define límites antes de operar</b><p>La demo no ejecuta órdenes ni accede a cuentas.</p></article></div>
    <p className="aoc-disclaimer">Prototipo visual con datos ficticios. No ofrece asesoría financiera, señales de compra/venta ni predicciones reales.</p>
  </section>
}

function GolpredDashboard() {
  const [tab, setTab] = useState<'calendar' | 'standings' | 'access'>('calendar')
  const [query, setQuery] = useState('')
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const matches = [
    { id: 'andino-union', home: 'Atlético Andino', away: 'Unión Capital', time: '16:00', league: 'Liga de muestra' },
    { id: 'bahia-montana', home: 'Deportivo Bahía', away: 'Real Montaña', time: '18:30', league: 'Copa de muestra' },
    { id: 'norte-sur', home: 'Club Norte', away: 'Club del Sur', time: '20:00', league: 'Liga de muestra' },
  ]
  const visibleMatches = matches.filter((match) => `${match.home} ${match.away} ${match.league}`.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es')))
  const standings = [
    ['1', 'Atlético Andino', '12', '27'], ['2', 'Deportivo Bahía', '12', '24'], ['3', 'Unión Capital', '12', '20'], ['4', 'Real Montaña', '12', '18'],
  ]
  return <section className="golpred-dashboard" aria-label="Demostración del panel GOLPRED">
    <header className="golpred-topbar"><div className="golpred-brand"><img src={publicAsset('/images/golpred-logo.png')} alt="" /><div><b>GOLPRED</b><small>Football intelligence · Demo</small></div></div><span className="golpred-demo-status"><i /> Entorno de muestra</span></header>
    <div className="golpred-dashboard-heading"><div><span>ANÁLISIS DE FÚTBOL</span><h3>Datos para explorar partidos</h3></div><span className="golpred-disclosure">SIN DATOS EN VIVO</span></div>
    <div className="golpred-tabs" role="tablist" aria-label="Vistas de GOLPRED">
      <button type="button" role="tab" aria-selected={tab === 'calendar'} className={tab === 'calendar' ? 'selected' : ''} onClick={() => setTab('calendar')}>Partidos</button>
      <button type="button" role="tab" aria-selected={tab === 'standings'} className={tab === 'standings' ? 'selected' : ''} onClick={() => setTab('standings')}>Tabla</button>
      <button type="button" role="tab" aria-selected={tab === 'access'} className={tab === 'access' ? 'selected' : ''} onClick={() => setTab('access')}>Acceso</button>
    </div>
    {tab === 'calendar' && <div className="golpred-calendar-view"><div className="golpred-search"><label htmlFor="golpred-search">Buscar partidos de muestra</label><div><input id="golpred-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Equipo o competencia" /><button type="button" onClick={() => setAnalysisComplete(true)}>Analizar</button></div></div>{analysisComplete && <p className="golpred-analysis-status" role="status">Análisis de demostración listo. No se consultaron partidos reales.</p>}<div className="golpred-match-list">{visibleMatches.length ? visibleMatches.map((match) => <article className="golpred-match" key={match.id}><div className="golpred-match-info"><span>{match.league} · Fixture ficticio</span><b>{match.home} <i>vs</i> {match.away}</b><small>Horario ilustrativo · {match.time}</small></div><button type="button" onClick={() => setSelectedMatch(selectedMatch === match.id ? null : match.id)}>{selectedMatch === match.id ? 'Ocultar' : 'Ver pronóstico demo'}</button>{selectedMatch === match.id && <div className="golpred-probabilities"><span><b>42%</b> Local</span><span><b>30%</b> Empate</span><span><b>28%</b> Visitante</span><small>Distribución inventada para mostrar la interfaz; no predice el resultado.</small></div>}</article>) : <p className="golpred-empty">No hay partidos de muestra que coincidan con esa búsqueda.</p>}</div></div>}
    {tab === 'standings' && <div className="golpred-standings-view"><div><span>LIGA DE MUESTRA</span><b>Tabla ilustrativa · Temporada demo</b></div><table><thead><tr><th>Pos.</th><th>Equipo</th><th>PJ</th><th>Pts</th></tr></thead><tbody>{standings.map(([position, team, played, points]) => <tr key={team}><td>{position}</td><td>{team}</td><td>{played}</td><td>{points}</td></tr>)}</tbody></table><small>Clasificación ficticia; no representa una liga real.</small></div>}
    {tab === 'access' && <div className="golpred-access-view"><div><span>VISTA DE ACCESO</span><h4>Inicio de sesión</h4><p>Diseño referencial. La autenticación aún no está conectada.</p><label>Usuario<input disabled placeholder="Usuario de demostración" /></label><label>Contraseña<input disabled type="password" placeholder="Campo visual de muestra" /></label><button type="button" disabled>Acceso no disponible en la demo</button></div></div>}
    <p className="golpred-safety-note">GOLPRED es un prototipo visual. Los partidos, estadísticas y pronósticos son ficticios; no son consejos de apuestas ni garantías de resultado.</p>
  </section>
}

function ProjectDialog({ project, onClose, onRequest }: { project: Project; onClose: () => void; onRequest: (project: Project) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeRef.current?.focus()
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const focusable = [...document.querySelectorAll<HTMLElement>('.project-dialog button, .project-dialog a, .project-dialog [tabindex]:not([tabindex="-1"])')]
        if (focusable.length === 0) return
        if (event.shiftKey && document.activeElement === focusable[0]) {
          event.preventDefault()
          focusable.at(-1)?.focus()
        } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) {
          event.preventDefault()
          focusable[0]?.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [onClose])
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className={`project-dialog ${project.id === 'aoc' ? 'aoc-dialog' : ''} ${project.id === 'golpred' ? 'golpred-dialog' : ''} ${project.id === 'crm' ? 'crm-dialog' : ''} ${project.id === 'core-desk' ? 'core-desk-dialog' : ''} ${project.id === 'lalas-magic-events' ? 'lalas-events-dialog' : ''} ${project.id === 'pozos-petronexus' ? 'oilintelligence-dialog' : ''} ${project.id === 'siigo-2' ? 'siigo-dialog' : ''}`} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <button ref={closeRef} className="icon-button dialog-close" onClick={onClose} aria-label="Cerrar detalle"><X size={20} /></button>
        <div className={`dialog-visual art-${project.id}`}><span className="art-label"><Sparkles size={13} /> {project.status === 'Beta' && project.id !== 'crm' && project.id !== 'siigo-2' ? 'Proyecto beta' : project.id === 'aoc' || project.id === 'golpred' || project.id === 'crm' || project.id === 'siigo-2' || project.id === 'core-desk' || project.id === 'lalas-magic-events' || project.id === 'pozos-petronexus' ? 'Capturas del proyecto' : 'Prototipo ilustrativo'}</span>{project.id === 'aoc' ? <ReferenceGallery label="Capturas del software AOT" images={[{ src: publicAsset('/images/aoc-analytics.png'), alt: 'AOT: panel de análisis de mercado', title: '01 · Panel de análisis' }, { src: publicAsset('/images/aoc-sessions.png'), alt: 'AOT: calendario y sesiones de mercado', title: '02 · Sesiones y calendario' }]} /> : project.id === 'golpred' ? <ReferenceGallery label="Nuevas capturas del software GOLPRED" images={[{ src: publicAsset('/images/golpred-overview.png'), alt: 'GOLPRED: resumen de análisis de fútbol', title: '01 · Resumen' }, { src: publicAsset('/images/golpred-calendar.png'), alt: 'GOLPRED: calendario de partidos y ligas', title: '02 · Calendario de partidos' }, { src: publicAsset('/images/golpred-match-result.png'), alt: 'GOLPRED: resultado y estadísticas de un partido', title: '03 · Resultado del partido' }, { src: publicAsset('/images/golpred-player-impact.png'), alt: 'GOLPRED: combinada e impacto individual de jugadores', title: '04 · Combinada de jugadores' }, { src: publicAsset('/images/golpred-standings.png'), alt: 'GOLPRED: tabla de posiciones Dimayor', title: '05 · Tabla de posiciones' }]} /> : project.id === 'crm' ? <ReferenceGallery label="Capturas del proyecto CRM Beta 2.0 IA" images={crmScreenshots} /> : project.id === 'siigo-2' ? <ReferenceGallery label="Capturas del software beta FACTURIX AI" images={siigoScreenshots} /> : project.id === 'core-desk' ? <ReferenceGallery label="Capturas del software CORE DESK" images={coreDeskScreenshots} /> : project.id === 'lalas-magic-events' ? <ReferenceGallery label="Capturas de Lala’s Magic Events" images={lalasEventsScreenshots} /> : project.id === 'pozos-petronexus' ? <ReferenceGallery label="Capturas del software NEXUS" images={oilintelligenceScreenshots} /> : project.id === 'excel-automation' ? <img className="excel-dialog-image" src={publicAsset('/images/excel-automation.png')} alt="Vista de referencia de Excel Automation" /> : <span className="art-icon"><Layers3 size={28} /></span>}<p>{project.name}</p></div>
        <div className="dialog-body">
          <div className="project-meta"><span>{project.category}</span><span className="status"><i />{project.status}</span></div>
          <h2 id="dialog-title">{project.name}</h2><p className="dialog-lead">{project.description}</p>
          <button type="button" className="project-request-button project-request-dialog" onClick={() => onRequest(project)}><ShoppingCart size={17} /> Solicitar información de este proyecto</button>
          {project.id === 'aoc' && <section className="aoc-purpose" aria-labelledby="aoc-purpose-title"><h3 id="aoc-purpose-title">AOT Trading Desk</h3><div className="detail-grid aoc-purpose-grid"><div><h3>Problema</h3><p>{project.problem}</p></div><div><h3>Solución</h3><p>{project.solution}</p></div><div><h3>Funcionalidades</h3><ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div><div><h3>Arquitectura y reto</h3><p>{project.architecture}</p><p>{project.challenge}</p></div></div></section>}
          {project.id === 'golpred' && <section className="golpred-purpose" aria-labelledby="golpred-purpose-title"><h3 id="golpred-purpose-title">GOLPRED – Football Intelligence</h3><div className="detail-grid golpred-purpose-grid"><div><h3>Problema</h3><p>{project.problem}</p></div><div><h3>Solución</h3><p>{project.solution}</p></div><div><h3>Funcionalidades</h3><ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div><div><h3>Arquitectura y reto</h3><p>{project.architecture}</p><p><b>Reto:</b> {project.challenge}</p></div><div className="golpred-objective"><h3>Objetivo</h3><p>{project.objective}</p></div></div></section>}
          {project.id === 'aoc' && <AocDashboard />}
          {project.id === 'golpred' && <GolpredDashboard />}
          {project.id === 'siigo-2' ? <section className="siigo-purpose" aria-labelledby="siigo-purpose-title"><h3 id="siigo-purpose-title">FACTURIX AI <span>— Advanced Billing Intelligence</span></h3><p className="siigo-purpose-subtitle">Facturación electrónica inteligente y automatización financiera.</p><div className="detail-grid siigo-purpose-grid"><div><h4>Problema</h4><p>{project.problem}</p></div><div><h4>Solución</h4><p>{project.solution}</p></div><div><h4>Funcionalidades</h4><ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div><div><h4>Arquitectura y reto</h4><p>{project.architecture}</p><p><b>Reto:</b> {project.challenge}</p></div><div className="siigo-objective"><h4>Objetivo</h4><p>{project.objective}</p></div></div><p className="siigo-demo-note">Las capturas muestran datos ficticios. La emisión y transmisión a la DIAN son simuladas; no se generan facturas electrónicas válidas ni se envían documentos reales.</p></section> : project.id === 'crm' ? <section className="crm-purpose" aria-labelledby="crm-purpose-title"><h3 id="crm-purpose-title">CRM BETA 2.0 IA <span>— Business Process Intelligence</span></h3><p className="crm-purpose-subtitle">Plataforma de gestión comercial y automatización de procesos empresariales.</p><div className="detail-grid crm-purpose-grid"><div><h4>Problema</h4><p>{project.problem}</p></div><div><h4>Solución</h4><p>{project.solution}</p></div><div><h4>Funcionalidades</h4><ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div><div><h4>Arquitectura y reto</h4><p>{project.architecture}</p><p><b>Reto:</b> {project.challenge}</p></div><div className="crm-objective"><h4>Objetivo</h4><p>{project.objective}</p></div></div></section> : project.status === 'Beta' && project.id !== 'core-desk' && project.id !== 'lalas-magic-events' && project.id !== 'pozos-petronexus' ? <section className="beta-project-note"><span>VERSIÓN BETA</span><p>Este proyecto ya está incluido en el catálogo. Su descripción detallada, funcionalidades y material visual se añadirán aquí.</p></section> : project.id !== 'aoc' && project.id !== 'golpred' && project.id !== 'core-desk' && project.id !== 'lalas-magic-events' && project.id !== 'pozos-petronexus' && <div className="detail-grid">
            <div><h3>Problema</h3><p>{project.problem}</p></div><div><h3>Solución</h3><p>{project.solution}</p></div>
            <div><h3>Funcionalidades</h3><ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
            <div><h3>Arquitectura y reto</h3><p>{project.architecture}</p><p>{project.challenge}</p></div>
          </div>}
          {project.id === 'core-desk' && <section className="core-desk-purpose" aria-labelledby="core-desk-purpose-title"><h3 id="core-desk-purpose-title">CORE DESK <span>— Gestión de soporte TI</span></h3><div className="detail-grid core-desk-purpose-grid"><div><h4>Problema</h4><p>{project.problem}</p></div><div><h4>Solución</h4><p>{project.solution}</p></div><div><h4>Funcionalidades</h4><ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div><div><h4>Arquitectura y reto</h4><p>{project.architecture}</p></div><div className="core-desk-objective"><h4>Objetivo</h4><p>{project.objective}</p></div></div><p className="core-desk-demo-note">Las capturas corresponden a una versión beta con datos de demostración.</p></section>}
          {project.id === 'lalas-magic-events' && <section className="lalas-events-purpose" aria-labelledby="lalas-events-title"><p className="lalas-events-eyebrow">EVENT PLANNING & EXPERIENCES</p><h3 id="lalas-events-title">Celebraciones con identidad propia</h3><p>Plataforma digital enfocada en la promoción y organización de eventos sociales y corporativos, incluyendo matrimonios, fiestas de quince años, bautizos, cumpleaños y eventos empresariales. Su objetivo es inspirar a los clientes, dar visibilidad a sus servicios y transformar cada celebración en una experiencia única, personalizada e inolvidable.</p><div className="lalas-event-types"><span>Matrimonios</span><span>Quince años</span><span>Bautizos</span><span>Cumpleaños</span><span>Eventos empresariales</span></div></section>}
          {project.id === 'pozos-petronexus' && <section className="oilintelligence-purpose" aria-labelledby="oilintelligence-title"><p className="oilintelligence-eyebrow">DATA ANALYTICS & PROCESS MANAGEMENT</p><h3 id="oilintelligence-title">NEXUS</h3><div className="detail-grid oilintelligence-grid"><div><h4>Problema</h4><p>{project.problem}</p></div><div><h4>Solución</h4><p>{project.solution}</p></div><div><h4>Funcionalidades</h4><ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div><div><h4>Arquitectura y reto</h4><p>{project.architecture}</p></div><div className="oilintelligence-objective"><h4>Objetivo</h4><p>{project.objective}</p></div></div></section>}
          {project.technologies.length > 0 && <div className="tag-row">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>}
        </div>
      </section>
    </div>
  )
}

const whatsappContacts = [
  { phone: '573123968427', label: '+57 312 396 8427' },
  { phone: '573236919594', label: '+57 323 691 9594' },
]

function ProjectInquiryModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [preparedMessage, setPreparedMessage] = useState('')
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  function prepareInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const values = new FormData(form)
    const name = String(values.get('inquiry-name') || '').trim()
    const email = String(values.get('inquiry-email') || '').trim()
    const phone = String(values.get('inquiry-phone') || '').trim()
    const reason = String(values.get('inquiry-reason') || '').trim()
    setPreparedMessage(`Hola, quiero recibir información sobre ${project.name}.\n\nNombre de persona o empresa: ${name}\nCorreo: ${email}\nCelular: ${phone}\nMotivo de contacto: ${reason}`)
  }

  return <div className="inquiry-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="inquiry-modal" role="dialog" aria-modal="true" aria-labelledby="inquiry-title"><button type="button" className="inquiry-close" aria-label="Cerrar formulario" onClick={onClose}><X size={19} /></button><span className="inquiry-eyebrow"><ShoppingCart size={15} /> SOLICITUD DE INFORMACIÓN</span><h2 id="inquiry-title">Hablemos de {project.name}</h2><p>Déjanos tus datos y elige a cuál asesor enviar tu solicitud por WhatsApp.</p><form onSubmit={prepareInquiry} onChange={() => setPreparedMessage('')}><label>Nombre de persona o empresa<input name="inquiry-name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Tu nombre o empresa" /></label><div className="inquiry-fields-row"><label>Correo electrónico<input name="inquiry-email" type="email" required maxLength={160} autoComplete="email" placeholder="tu@correo.com" /></label><label>Número de celular<input name="inquiry-phone" type="tel" required minLength={7} maxLength={20} pattern="[0-9+() -]{7,20}" autoComplete="tel" placeholder="+57 300 000 0000" /></label></div><label>Motivo del contacto<textarea name="inquiry-reason" required minLength={5} maxLength={700} rows={3} placeholder="Cuéntanos qué necesitas para este proyecto" /></label><label className="inquiry-consent"><input type="checkbox" name="inquiry-consent" required /><span>Acepto compartir estos datos por WhatsApp para recibir respuesta sobre esta solicitud.</span></label><button type="submit" className="inquiry-submit"><ShoppingCart size={16} /> Preparar solicitud</button></form>{preparedMessage && <div className="inquiry-whatsapp" role="status"><p>Solicitud lista. Elige un asesor; WhatsApp abrirá el mensaje para que confirmes el envío.</p>{whatsappContacts.map((contact) => <a key={contact.phone} href={`https://wa.me/${contact.phone}?text=${encodeURIComponent(preparedMessage)}`} target="_blank" rel="noreferrer"><ArrowUpRight size={15} /> Enviar al {contact.label}</a>)}</div>}<small className="inquiry-privacy">Tus datos se incluyen en el mensaje que tú envíes desde WhatsApp.</small></section></div>
}

export default function App() {
  const getPageFromHash = (): PageKey => {
    const value = window.location.hash.slice(1)
    if (value === 'creador') return 'studio'
    return ['inicio', 'proyectos', 'prototipos', 'precios', 'studio', 'contacto'].includes(value) ? value as PageKey : 'inicio'
  }
  const [page, setPage] = useState(getPageFromHash)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const [technology, setTechnology] = useState('Todas')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [inquiryProject, setInquiryProject] = useState<Project | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactStatus, setContactStatus] = useState('')
  const [whatsappMessage, setWhatsappMessage] = useState('')

  useEffect(() => {
    const syncPage = () => setPage(getPageFromHash())
    window.addEventListener('popstate', syncPage)
    window.addEventListener('hashchange', syncPage)
    return () => {
      window.removeEventListener('popstate', syncPage)
      window.removeEventListener('hashchange', syncPage)
    }
  }, [])

  function handleInternalNavigation(event: MouseEvent<HTMLElement>) {
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
    if (!anchor) return
    const destination = anchor.getAttribute('href')?.slice(1)
    if (!destination) return
    event.preventDefault()
    const aliases: Record<string, PageKey> = { creador: 'studio' }
    const nextPage = aliases[destination] ?? (['inicio', 'proyectos', 'prototipos', 'precios', 'studio', 'contacto'].includes(destination) ? destination as PageKey : null)
    if (!nextPage) return
    window.history.pushState(null, '', `#${destination}`)
    setPage(nextPage)
    setMenuOpen(false)
    if (!/jsdom/i.test(navigator.userAgent)) window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('es')
    const result = prototypes.filter((project) => {
      const content = `${project.name} ${project.summary} ${project.category} ${project.technologies.join(' ')}`.toLocaleLowerCase('es')
      return (!normalizedQuery || content.includes(normalizedQuery)) &&
        (category === 'Todas' || project.category === category) &&
        (technology === 'Todas' || project.technologies.includes(technology))
    })
    return result.sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name, 'es') : Number(b.featured) - Number(a.featured))
  }, [query, category, technology, sortBy])

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const values = new FormData(form)
    const name = String(values.get('name') || '').trim()
    const email = String(values.get('email') || '').trim()
    const company = String(values.get('company') || '').trim()
    const reason = String(values.get('reason') || '').trim()
    const message = String(values.get('message') || '').trim()
    setWhatsappMessage(`Hola, estoy interesado/a en sus servicios.\n\nNombre: ${name}\nCorreo: ${email}\nEmpresa: ${company || 'No especificada'}\nMotivo: ${reason}\n\nMensaje:\n${message}`)
    setContactStatus('Información validada. Elige a cuál asesor quieres escribirle por WhatsApp y confirma el envío en la aplicación.')
  }

  const whatsappUrl = (phone: string) => `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`

  const nav = <><a className={page === 'proyectos' ? 'active' : ''} aria-current={page === 'proyectos' ? 'page' : undefined} href="#proyectos">Quiénes somos</a><a className={page === 'prototipos' ? 'active' : ''} aria-current={page === 'prototipos' ? 'page' : undefined} href="#prototipos">Prototipos</a><a className={page === 'precios' ? 'active' : ''} aria-current={page === 'precios' ? 'page' : undefined} href="#precios">Precios</a><a className={page === 'studio' ? 'active' : ''} aria-current={page === 'studio' ? 'page' : undefined} href="#creador">Studio</a></>

  return (
    <div className="app-shell" onClickCapture={handleInternalNavigation}>
      <div className="holo-corridor" aria-hidden="true"><video className="holo-video" autoPlay muted loop playsInline preload="auto" poster={publicAsset('/images/neon-ai-corridor-fullhd.svg')}><source src={publicAsset('/videos/devcore-background.mp4')} type="video/mp4" /></video><span className="holo-particles" /></div>
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="DevCore Advance, inicio"><span className="wordmark-icon"><img src={publicAsset('/images/devcore-advance-mark.svg')} alt="" /></span><span>DEVCORE ADVANCE</span></a>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegación principal">{nav}<a className="nav-contact" href="#contacto" onClick={() => setMenuOpen(false)}>Hablemos <ArrowUpRight size={15} /></a></nav>
        <button className="icon-button mobile-menu" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main>
        {page === 'inicio' && <>
        <section className="hero section-wrap" id="inicio">
          <div className="hero-copy"><span className="kicker"><i /> DESARROLLO DE SOFTWARE · AUTOMATIZACIÓN</span><h1>Ideas que se convierten en <span>software útil.</span></h1><p className="hero-description">En DevCore Advance diseñamos soluciones digitales, automatizamos procesos e integramos inteligencia artificial para responder a las necesidades de cada empresa.</p><div className="hero-actions"><a className="button button-primary" href="#proyectos">Conoce DevCore Advance <ArrowDownRight size={17} /></a></div><div className="hero-note"><span className="note-line" />Portafolio en construcción, con prototipos identificados con transparencia.</div></div>
          <div className="hero-visual" aria-label="Ilustración de panel tecnológico"><div className="visual-glow" /><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-window"><div className="window-top"><div className="window-dots"><i /><i /><i /></div><span>workspace / overview</span><span className="window-live"><i /> LIVE PREVIEW</span></div><div className="window-main"><div className="window-sidebar"><div className="sidebar-logo"><Layers3 size={15} /></div><i className="selected" /><i /><i /><i /></div><div className="window-content"><div className="window-heading"><div><small>VISTA GENERAL</small><strong>Tu espacio de trabajo</strong></div><span className="window-date">Hoy <ChevronDown size={12} /></span></div><div className="metric-row"><div className="metric"><small>Proyectos en catálogo</small><b>03</b><span>prototipos visuales</span></div><div className="metric"><small>Tecnologías</small><b>12<span className="metric-plus">+</span></b><span>en el stack de referencia</span></div></div><div className="chart-card"><div className="chart-title"><span>Actividad de ejemplo</span><span className="faux-badge">DATOS SINTÉTICOS</span></div><svg viewBox="0 0 380 100" role="img" aria-label="Gráfica ilustrativa de actividad"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#43d9ee" stopOpacity=".24"/><stop offset="1" stopColor="#43d9ee" stopOpacity="0"/></linearGradient></defs><path d="M0 74 C28 66 35 78 61 59 S105 63 132 48 S171 60 194 37 S235 48 260 25 S301 47 326 26 S359 32 380 12 L380 100 L0 100Z" fill="url(#fill)"/><path d="M0 74 C28 66 35 78 61 59 S105 63 132 48 S171 60 194 37 S235 48 260 25 S301 47 326 26 S359 32 380 12" fill="none" stroke="#44d8eb" strokeWidth="2"/></svg><div className="chart-labels"><span>SEM 01</span><span>SEM 02</span><span>SEM 03</span><span>SEM 04</span></div></div></div></div></div><div className="floating-chip chip-top"><span className="chip-icon cyan"><Code2 size={15} /></span><span><b>Full stack</b><small>De la idea al producto</small></span></div><div className="floating-chip chip-bottom"><span className="chip-icon violet"><Sparkles size={15} /></span><span><b>Automatización</b><small>Menos tareas repetitivas</small></span><span className="chip-check"><Check size={14} /></span></div></div>
        </section>

        <section className="proof-strip"><div><span className="proof-symbol">01</span><p><b>Proyectos y prototipos separados</b><small>Explora cada tipo de trabajo en su propia sección</small></p></div><div><span className="proof-symbol">02</span><p><b>Stack moderno</b><small>Frontend y backend preparados para crecer</small></p></div><div><span className="proof-symbol">03</span><p><b>Enfoque práctico</b><small>Automatización y soluciones de software</small></p></div></section>
        <section className="home-shortcuts section-wrap"><a href="#proyectos"><span className="section-eyebrow">TRABAJO PUBLICADO</span><h2>Proyectos</h2><p>Consulta los trabajos reales que se vayan agregando al portafolio.</p><span className="text-link">Ver proyectos <ArrowRight size={16} /></span></a><a href="#prototipos"><span className="section-eyebrow">IDEAS EN EXPLORACIÓN</span><h2>Prototipos</h2><p>Prueba demostraciones y alternativas interactivas en desarrollo.</p><span className="text-link">Explorar prototipos <ArrowRight size={16} /></span></a><a href="#creador"><span className="section-eyebrow">CREADOR VISUAL</span><h2>Studio</h2><p>Arma una propuesta de página con herramientas visuales.</p><span className="text-link">Abrir Studio <ArrowRight size={16} /></span></a></section>
        </>}

        {page === 'proyectos' && <section className="projects-section section-wrap innova-core-profile" id="proyectos">
          <div className="section-heading"><div><span className="section-eyebrow">01 / CONOCE A DEVCORE ADVANCE</span><h2>Desarrollo de software y <span>automatización inteligente.</span></h2><p>Un proyecto de ingeniería de software que convierte retos empresariales en soluciones digitales personalizadas.</p></div></div>
          <div className="innova-core-intro-grid">
            <article className="innova-core-panel innova-core-about"><span className="innova-core-index">01 / EQUIPO</span><h3>¿Quiénes somos?</h3><p>DevCore Advance es un proyecto de ingeniería de software enfocado en desarrollar soluciones tecnológicas personalizadas, automatizar procesos empresariales e implementar tecnologías avanzadas como Machine Learning, adaptándonos a las necesidades de empresas de diferentes sectores e industrias.</p></article>
            <article className="innova-core-panel innova-core-proposal"><span className="innova-core-index">02 / PROPUESTA</span><h3>Transformamos requerimientos en soluciones.</h3><p>Integramos desarrollo frontend y backend, bases de datos SQL y automatización para optimizar operaciones, mejorar la gestión de información y aumentar la eficiencia de los procesos.</p><div className="innova-core-capabilities"><span>Frontend & backend</span><span>Bases de datos SQL</span><span>Automatización</span><span>Machine Learning</span></div></article>
          </div>
          <section className="innova-core-team" aria-labelledby="innova-core-team-title"><div className="innova-core-section-heading"><div><span className="innova-core-index">03 / PERSONAS</span><h3 id="innova-core-team-title">Nuestro equipo</h3></div></div><div className="innova-core-team-grid">
            <article className="innova-core-person"><img className="innova-core-avatar innova-core-avatar-image" src={publicAsset('/images/alexander-developer.svg')} alt="Ilustración de Alexander Sabogal como desarrollador" /><div><h4>Alexander Sabogal</h4><p className="innova-core-role">Líder de proyectos y automatización</p><p>Responsable de liderar proyectos, gestionar requerimientos de clientes y coordinar procesos de desarrollo y automatización frontend y backend.</p></div></article>
            <article className="innova-core-person"><img className="innova-core-avatar innova-core-avatar-alt innova-core-avatar-image" src={publicAsset('/images/yonathan-developer.svg')} alt="Ilustración de Yonathan Molina como desarrollador" /><div><h4>Yonathan Molina</h4><p className="innova-core-role">Ingeniero de Desarrollo de Software y Coordinador de Operaciones</p><p>Encargado de coordinar las operaciones técnicas, desarrollar funcionalidades e implementar soluciones frontend y backend según los requerimientos de cada proyecto.</p></div></article>
          </div></section>
          <section className="innova-core-portfolio" aria-labelledby="innova-core-portfolio-title"><div className="innova-core-section-heading"><div><span className="innova-core-index">04 / PORTAFOLIO</span><h3 id="innova-core-portfolio-title">Soluciones y desarrollos en curso</h3><p>Explora los productos beta y prototipos que estamos diseñando para diferentes necesidades empresariales.</p></div><a className="button button-primary" href="#prototipos">Explorar portafolio <ArrowRight size={17} /></a></div><div className="innova-core-project-list">{prototypes.map((project) => <div className="innova-core-project-chip" key={project.id}><span><b>{project.name}</b><small>{project.category}</small></span><i className={project.status === 'Beta' ? 'is-beta' : ''}>{project.status}</i></div>)}</div></section>
          <section className="innova-core-mission" aria-labelledby="innova-core-mission-title"><span className="innova-core-index">05 / PROPÓSITO</span><div><h3 id="innova-core-mission-title">Nuestra misión</h3><p>Desarrollar soluciones tecnológicas innovadoras que permitan a las empresas optimizar sus procesos, automatizar tareas y avanzar en su transformación digital.</p></div><strong>DevCore Advance — Transformamos procesos en soluciones inteligentes.</strong></section>
        </section>}

        {page === 'prototipos' && <>
        <section className="projects-section section-wrap" id="prototipos">
          <div className="section-heading"><div><span className="section-eyebrow">01 / EXPLORADOR DE PROTOTIPOS</span><h2>Prototipos <span>funcionales.</span></h2><p>Ideas de interfaz y demostraciones para explorar. Cada ficha indica cuando usa datos ficticios o una simulación.</p></div></div>
          <div className="catalog-note"><Sparkles size={16} /><span>El catálogo reúne prototipos de interfaz y proyectos beta, cada uno identificado por su estado.</span></div>
          <div className="filters"><label className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar proyectos o tecnologías" aria-label="Buscar proyectos o tecnologías" />{query && <button aria-label="Limpiar búsqueda" onClick={() => setQuery('')}><X size={15} /></button>}</label><label className="select-field"><span>Categoría</span><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filtrar por categoría">{categories.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></label><label className="select-field"><span>Tecnología</span><select value={technology} onChange={(event) => setTechnology(event.target.value)} aria-label="Filtrar por tecnología">{technologies.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></label><label className="select-field sort-select"><span>Ordenar</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Ordenar proyectos"><option value="featured">Destacados</option><option value="name">Nombre</option></select><ChevronDown size={14} /></label></div>
          {filteredProjects.length ? <div className="project-grid">{filteredProjects.map((project) => <ProjectCard key={project.id} project={project} onOpen={setSelectedProject} onRequest={setInquiryProject} />)}</div> : <div className="empty-state"><Search size={23} /><h3>No encontramos coincidencias</h3><p>Prueba con otra búsqueda o restablece los filtros.</p><button className="button button-quiet" onClick={() => { setQuery(''); setCategory('Todas'); setTechnology('Todas') }}>Limpiar filtros <X size={15} /></button></div>}
        </section>

        </>}

        {page === 'precios' && <Pricing />}
        {page === 'studio' && <Studio />}

        {page === 'contacto' && <section className="contact-section section-wrap" id="contacto"><div className="contact-intro"><span className="section-eyebrow">05 / CONTACTO</span><h2>¿Tienes algo<br />en <span>mente?</span></h2><p>Cuéntame sobre tu idea, oportunidad o proyecto y coordinamos una asesoría por WhatsApp.</p><div className="contact-hint"><Mail size={17} /><span>Al validar el formulario podrás elegir a cuál de nuestros asesores enviar tu consulta.</span></div></div><form className="contact-form" onChange={() => { if (whatsappMessage) { setWhatsappMessage(''); setContactStatus('') } }} onSubmit={submitContact}><div className="form-row"><label>Nombre<input name="name" autoComplete="name" required minLength={2} placeholder="Tu nombre" /></label><label>Correo electrónico<input type="email" name="email" autoComplete="email" required placeholder="tu@correo.com" /></label></div><label>Empresa <span className="optional">OPCIONAL</span><input name="company" autoComplete="organization" placeholder="Nombre de tu empresa" /></label><label>Motivo del contacto<select name="reason" defaultValue="" required><option value="" disabled>Selecciona una opción</option><option>Oportunidad laboral</option><option>Proyecto o contrato</option><option>Colaboración</option><option>Otro</option></select></label><label>Mensaje<textarea name="message" rows={4} required minLength={10} maxLength={3000} placeholder="Cuéntame un poco sobre lo que tienes en mente…" /></label><button className="button button-primary submit-button" type="submit">Validar y enviar <ArrowUpRight size={16} /></button><p className={`form-status ${whatsappMessage ? 'success' : ''}`} role="status">{contactStatus}</p>{whatsappMessage && <div className="whatsapp-actions"><a className="button whatsapp-button" href={whatsappUrl('573123968427')} target="_blank" rel="noreferrer">Enviar al +57 312 396 8427 <ArrowUpRight size={15} /></a><a className="button whatsapp-button secondary" href={whatsappUrl('573236919594')} target="_blank" rel="noreferrer">Enviar al +57 323 691 9594 <ArrowUpRight size={15} /></a><small>El mensaje se prepara con los datos del formulario. Repite el envío al segundo número si deseas contactar a ambos asesores.</small></div>}<small className="form-privacy">No compartas información confidencial en este formulario.</small></form></section>}
      </main>

      <footer className="site-footer"><a className="wordmark" href="#inicio" aria-label="DevCore Advance, inicio"><span className="wordmark-icon"><img src={publicAsset('/images/devcore-advance-mark.svg')} alt="" /></span><span>DEVCORE ADVANCE</span></a><span>Hecho con intención. © {new Date().getFullYear()}</span><a href="#inicio" className="back-top">Volver arriba <ArrowUpRight size={14} /></a><div className="social-links" aria-label="Redes profesionales"><span title="Enlace de GitHub pendiente de configurar" aria-label="GitHub, enlace pendiente">GH</span><span title="Enlace de LinkedIn pendiente de configurar" aria-label="LinkedIn, enlace pendiente">in</span><span title="Correo pendiente de configurar" aria-label="Correo, enlace pendiente"><Mail size={16} /></span></div></footer>
      {selectedProject && <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} onRequest={(project) => { setSelectedProject(null); setInquiryProject(project) }} />}
      {inquiryProject && <ProjectInquiryModal project={inquiryProject} onClose={() => setInquiryProject(null)} />}
    </div>
  )
}
