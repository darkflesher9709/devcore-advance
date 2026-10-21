# Portafolio de software

Sitio web de DevCore Advance con portafolio, prototipos interactivos, Studio y gestión comercial.

## Carpetas

- `front/`: aplicación React, TypeScript y Vite. Las imágenes y el video están en `front/public/`.
- `backend/`: API FastAPI para la pestaña Precios y cotizaciones.
- `.github/workflows/deploy-pages.yml`: compila el frontend y lo publica en GitHub Pages cuando se suben cambios a `main` o `master`.

El repositorio ya está inicializado en esta carpeta. El `.gitignore` excluye `node_modules`, `dist`, entornos virtuales, cachés, bases SQLite locales y archivos `.env`. Los archivos `.env.example` sí se suben.

## Subirlo y publicarlo

1. Crea un repositorio vacío en GitHub, sin README ni archivos iniciales.
2. Abre PowerShell en `C:\PORTAFOLIO_APPS` y conecta el repositorio. Reemplaza la URL por la que te dio GitHub:

```powershell
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git add .
git commit -m "Preparar portafolio para publicación"
git branch -M main
git push -u origin main
```

3. En GitHub entra a **Settings → Pages** y selecciona **GitHub Actions** como fuente.
4. Entra a **Actions** y espera a que termine “Publicar portafolio en GitHub Pages”. El enlace de tu página aparecerá en **Settings → Pages**.

Sube la carpeta raíz completa como repositorio, manteniendo `front/` y `backend/` dentro de ella. No es necesario subir `front/dist/`: GitHub Actions compila `front/` y publica el resultado. Los assets ajustan su ruta automáticamente para repositorios de GitHub Pages.

## Qué queda publicado

GitHub Pages sirve el portafolio, los prototipos y el formulario de contacto por WhatsApp. La pestaña **Precios** necesita que la API FastAPI esté desplegada aparte y que `VITE_API_URL` se configure como variable del repositorio en **Settings → Secrets and variables → Actions → Variables**. Si no está configurada, la pestaña informa que falta conectar la API.

El backend actual permite editar tarifas y cotizaciones y todavía no tiene autenticación. Protégelo antes de exponerlo en Internet. Al desplegarlo, configura HTTPS y CORS para el dominio de GitHub Pages. No subas archivos `.env` ni credenciales.

## Desarrollo local

Consulta [frontend](front/README.md) y [backend](backend/README.md). Copia las plantillas `.env.example` como `.env.local` o `.env` según corresponda; esos archivos locales están excluidos de Git.
