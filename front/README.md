# Frontend del portafolio

Aplicación web responsive con React, TypeScript, Vite, Tailwind CSS y Lucide React.

## Requisitos

- Node.js 24.18.1
- npm 11.16.0

## Desarrollo

```powershell
npm install
npm run dev
```

## Compilación y pruebas

```powershell
npm run build
npm test -- --run
```

## Catálogo y contacto

Los datos tipados del catálogo están centralizados en `src/projects.ts`. Las fichas iniciales son prototipos visuales con datos ficticios; reemplázalas por información verificada antes de presentar proyectos reales.

Copia `.env.example` a `.env.local` y define `VITE_CONTACT_ENDPOINT` para conectar el formulario con un servicio de contacto que acepte `POST` JSON. Si no está configurado, la interfaz explica que el formulario no ha enviado el mensaje. La URL de servicio es pública en el bundle del navegador; no pongas secretos en variables `VITE_*`.

## Precios y cotizaciones

La página `#precios` consume la API FastAPI del directorio `../backend`. Copia `VITE_API_URL=http://localhost:8000` desde `.env.example` a `.env.local`, inicia el backend y luego Vite. Los servicios y cotizaciones se guardan en SQLite en `backend/data/pricing.sqlite3` por defecto. La impresión de una cotización abre el diálogo del navegador para imprimir o guardarla como PDF. No se envían correos y no hay autenticación todavía; no expongas la API públicamente sin añadirla.

## Studio: creador visual y automatizaciones

El prototipo de Studio está en `src/Studio.tsx`. Permite elegir una plantilla, describir una necesidad en lenguaje cotidiano, elegir qué funciones mostrar, ver una imagen local como referencia, generar una propuesta inicial, editar y ordenar bloques, guardar un borrador y descargar una vista previa HTML independiente. También permite diseñar y simular flujos de automatización. Las acciones simuladas no envían información ni llaman servicios externos. La imagen no se interpreta con IA todavía; para habilitar esa función se debe conectar un servicio seguro del backend y pedir consentimiento antes de enviar la referencia.

## Publicación

Ejecuta `npm run build` y publica el contenido de `dist/` en un hosting estático. Configura el hosting para devolver `index.html` en las rutas de la aplicación. Si conectas un servicio de contacto, restringe su origen y configura validación, límites de frecuencia y protección contra spam en ese servicio.
