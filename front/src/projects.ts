export type ProjectStatus = 'Prototipo visual' | 'Beta'

export type Project = {
  id: string
  slug: string
  name: string
  summary: string
  description: string
  category: string
  technologies: string[]
  status: ProjectStatus
  featured: boolean
  problem: string
  solution: string
  features: string[]
  architecture: string
  challenge: string
  objective?: string
  updatedAt: string
}

// Portfolio interface prototypes, not claims about finished client work.
// Replace or extend this central catalog with verified project information.
export const prototypes: Project[] = [
  {
    id: 'golpred', slug: 'golpred', name: 'GOLPRED',
    summary: 'Una experiencia de análisis de fútbol con calendario, posiciones y pronósticos de muestra.',
    description: 'Prototipo visual de GOLPRED inspirado en las referencias compartidas: calendario de partidos, tabla de posiciones y acceso a la plataforma. Sus pronósticos y resultados de demostración son ficticios.',
    category: 'Fútbol y pronósticos', technologies: ['React', 'TypeScript', 'SVG'], status: 'Prototipo visual', featured: true,
    problem: 'La información deportiva está dispersa entre múltiples fuentes, lo que dificulta analizar partidos, comparar estadísticas de equipos y jugadores, evaluar tendencias y determinar la probabilidad de diferentes resultados en las apuestas deportivas.',
    solution: 'Una plataforma inteligente de análisis y pronósticos de fútbol que centraliza estadísticas, calendarios, resultados y métricas de rendimiento para generar predicciones fundamentadas en datos y apoyar la toma de decisiones deportivas.',
    features: [
      'Consulta de partidos, ligas y calendarios deportivos.',
      'Análisis y pronósticos de resultados por partido.',
      'Comparación de equipos, jugadores y estadísticas.',
      'Combinadas de partidos y jugadores.',
      'Análisis de estrategias y tendencias deportivas.',
      'Visualización de resultados históricos y datos reales.',
      'Panel de seguimiento de competiciones y partidos en vivo.',
      'Sistema de indicadores, alertas y evaluación de pronósticos.',
    ],
    architecture: 'Desarrollar una plataforma modular e interactiva que integre fuentes de información deportiva, procese estadísticas mediante modelos de análisis predictivo y presente resultados en un dashboard intuitivo.',
    challenge: 'Mejorar continuamente la precisión de los pronósticos, validar los modelos con datos históricos y medir su rendimiento mediante métricas estadísticas.',
    objective: 'Convertir GOLPRED en una plataforma de inteligencia deportiva capaz de transformar datos futbolísticos en pronósticos cuantificables, transparentes y evaluables, ayudando a los usuarios a comprender mejor los posibles escenarios de cada encuentro.',
    updatedAt: '2026-10-16',
  },
  {
    id: 'aoc', slug: 'aoc', name: 'AOT',
    summary: 'Panel visual para explorar mercados, escenarios y riesgo en un entorno de demostración.',
    description: 'Primer prototipo de AOT: un espacio de análisis que organiza información ilustrativa del mercado para ayudar a explorar escenarios. No usa cotizaciones en vivo ni genera recomendaciones de inversión.',
    category: 'Trading y análisis', technologies: ['React', 'TypeScript', 'SVG'], status: 'Prototipo visual', featured: true,
    problem: 'La información de mercado puede resultar dispersa y difícil de interpretar para quien está empezando.',
    solution: 'AOT propone un panel que reúne sesiones, una gráfica de ejemplo y contexto de riesgo para explorar una idea de forma más ordenada.',
    features: ['Gráficos financieros y volumen', 'Monitor de sesiones internacionales', 'Testing y análisis de estrategias', 'Módulos de analítica y alertas'],
    architecture: 'Diseñar una interfaz modular e interactiva que centralice herramientas de trading, facilite la interpretación de datos y permita futuras integraciones con fuentes financieras.',
    challenge: 'La demo actual usa datos sintéticos y no conecta con servicios financieros; cualquier integración futura deberá identificar con claridad el origen y la vigencia de los datos.', updatedAt: '2026-10-16',
  },
  {
    id: 'excel-automation', slug: 'excel-automation', name: 'Excel Automation',
    summary: 'Unifica archivos de Excel, compara inventarios y prepara reportes desde un solo lugar.',
    description: 'Prototipo visual de una herramienta para cargar hojas de cálculo, cruzar información, validar datos y presentar resultados comparativos. La interfaz es ilustrativa y no procesa archivos todavía.',
    category: 'Automatización de datos', technologies: ['React', 'TypeScript', 'Excel'], status: 'Prototipo visual', featured: false,
    problem: 'Revisar manualmente varios archivos de Excel consume tiempo y facilita errores al comparar datos.',
    solution: 'Una experiencia centralizada para organizar archivos, automatizar comparaciones y mostrar resultados en un panel claro.',
    features: ['Carga de varios archivos de Excel', 'Cruce y comparación de información', 'Validación de datos', 'Resumen visual por producto', 'Exportación ilustrativa de reportes'],
    architecture: 'Prototipo de interfaz para un flujo de carga, procesamiento, visualización de resultados y generación de reportes.',
    challenge: 'Conectar la interfaz con el procesamiento real de hojas de cálculo y comunicar claramente errores y resultados de validación.', updatedAt: '2026-10-16',
  },
  {
    id: 'siigo-2', slug: 'siigo-2', name: 'Facturador electrónico',
    summary: 'Facturación electrónica inteligente y automatización financiera.',
    description: 'FACTURIX AI — Advanced Billing Intelligence',
    category: 'Gestión empresarial', technologies: [], status: 'Beta', featured: false,
    problem: 'Los procesos de facturación pueden requerir múltiples tareas manuales, validaciones, registros repetitivos y seguimiento independiente de pagos y documentos, generando demoras, errores operativos y dificultades para consolidar la información financiera.',
    solution: 'Una plataforma avanzada que conecta la facturación electrónica con la automatización de procesos financieros, la gestión documental y el análisis de información, permitiendo centralizar operaciones y reducir la intervención manual.',
    features: [
      'Generación y gestión de facturas electrónicas.',
      'Automatización de procesos de facturación.',
      'Validación y seguimiento del estado documental.',
      'Gestión de cartera y alertas de vencimiento.',
      'Integración mediante API con otros sistemas.',
      'Panel financiero e indicadores operativos.',
      'Asistencia inteligente para tareas administrativas.',
    ],
    architecture: 'Diseñar una arquitectura modular, segura e integrable que permita procesar documentos, ejecutar reglas de negocio, mantener trazabilidad y ofrecer información financiera confiable.',
    challenge: 'Automatizar operaciones de alto volumen manteniendo la integridad de los datos y el cumplimiento de los requisitos tributarios aplicables.',
    objective: 'Transformar la facturación tradicional en un ecosistema inteligente de gestión financiera, capaz de conectar documentos, procesos, pagos e información empresarial para mejorar la eficiencia operativa, la trazabilidad y la toma de decisiones.',
    updatedAt: '2026-10-17',
  },
  {
    id: 'crm', slug: 'crm', name: 'CRM BETA 2.0 IA',
    summary: 'Plataforma de gestión comercial y automatización de procesos empresariales.',
    description: 'CRM BETA 2.0 IA — Business Process Intelligence',
    category: 'Gestión empresarial', technologies: [], status: 'Beta', featured: false,
    problem: 'La gestión de clientes, oportunidades comerciales y actividades operativas puede depender de procesos manuales y de información dispersa, dificultando el seguimiento, la coordinación entre equipos y la visibilidad del estado de cada proceso.',
    solution: 'Un CRM empresarial que centraliza la información y automatiza procesos clave, facilitando la gestión comercial, el seguimiento de actividades y el control de las operaciones desde una plataforma unificada.',
    features: [
      'Centralización de información empresarial.',
      'Automatización de tareas y flujos de trabajo.',
      'Gestión y seguimiento de procesos.',
      'Organización de actividades y responsables.',
      'Visualización del estado de los procesos.',
      'Seguimiento mediante indicadores y reportes.',
    ],
    architecture: 'Diseñar una solución modular que se adapte a los procesos empresariales, reduzca tareas repetitivas y permita consultar información centralizada para mejorar el control operativo y la toma de decisiones.',
    challenge: 'Convertir procesos empresariales en flujos de trabajo organizados, trazables y medibles.',
    objective: 'Transformar la gestión empresarial mediante una plataforma CRM que optimice los procesos internos, mejore la organización de la información, facilite el seguimiento de las actividades y proporcione una base para una operación más eficiente, controlada y escalable.',
    updatedAt: '2026-10-17',
  },
  {
    id: 'core-desk', slug: 'core-desk', name: 'CORE DESK',
    summary: 'Sistema de soporte TI para centralizar tickets, asignaciones y seguimiento de incidentes.',
    description: 'Software beta para gestionar solicitudes de soporte, organizar casos y dar visibilidad a la atención y resolución de incidentes tecnológicos.',
    category: 'Operaciones', technologies: [], status: 'Beta', featured: false,
    problem: 'La gestión de incidentes y solicitudes de soporte puede generar demoras, falta de seguimiento y poca visibilidad sobre el estado de los casos.',
    solution: 'Software beta diseñado para centralizar tickets de soporte, organizar casos y facilitar la atención, asignación y resolución de incidentes tecnológicos.',
    features: [
      'Creación y seguimiento de tickets.',
      'Clasificación por prioridad, categoría y estado.',
      'Asignación de casos a técnicos responsables.',
      'Historial de atención y gestión de incidencias.',
      'Panel de control y seguimiento operativo.',
    ],
    architecture: 'Desarrollar una plataforma modular que permita gestionar el ciclo de vida de los casos, mejorar la trazabilidad y optimizar los tiempos de respuesta.',
    challenge: '',
    objective: 'Simplificar y centralizar la gestión del soporte TI mediante un sistema de tickets que mejore el control de incidentes, la organización del equipo técnico y la calidad del servicio.',
    updatedAt: '2026-10-17',
  },
  {
    id: 'pozos-petronexus', slug: 'nexus', name: 'NEXUS',
    summary: 'Plataforma de analítica para organizar información, visualizar indicadores y dar seguimiento a procesos operativos.',
    description: 'NEXUS — Data Analytics & Process Management',
    category: 'Analítica y datos', technologies: [], status: 'Beta', featured: false,
    problem: 'La información operativa y estadística puede estar dispersa, dificultando el seguimiento de procesos, el análisis de indicadores y la identificación de oportunidades de mejora.',
    solution: 'Plataforma beta para centralizar información, analizar estadísticas y facilitar el seguimiento de procesos mediante herramientas digitales de gestión y visualización de datos.',
    features: [
      'Centralización y organización de información operativa.',
      'Visualización de estadísticas e indicadores operativos.',
      'Seguimiento y análisis de procesos.',
      'Identificación de tendencias y posibles oportunidades de mejora.',
      'Paneles de control para facilitar la interpretación de datos.',
    ],
    architecture: 'Desarrollar una plataforma modular y escalable que permita organizar datos, facilitar su análisis estadístico y proporcionar una visión estructurada de los procesos operativos para apoyar la toma de decisiones.',
    challenge: '',
    objective: 'Optimizar la gestión y el análisis de información mediante una solución tecnológica que facilite el seguimiento operativo, la interpretación de estadísticas y la identificación de oportunidades de mejora.',
    updatedAt: '2026-10-17',
  },
  {
    id: 'lalas-magic-events', slug: 'lalas-magic-events', name: 'DISEÑOS DE PÁGINAS WEB',
    summary: 'Promoción y organización de eventos sociales y corporativos en experiencias memorables.',
    description: 'LALA’S MAGIC EVENTS — Event Planning & Experiences',
    category: 'Eventos', technologies: [], status: 'Beta', featured: false,
    problem: '', solution: '', features: [], architecture: '', challenge: '', updatedAt: '2026-10-17',
  },
]

// Keep verified work and interface prototypes in separate catalogs.
export const projects: Project[] = []

export const categories = ['Todas', ...new Set(prototypes.map((project) => project.category))]
export const technologies = ['Todas', ...new Set(prototypes.flatMap((project) => project.technologies))]
