# Portafolio de software

Sitio web de DevCore Advance con portafolio, prototipos interactivos, Studio y gestión comercial.

## Carpetas

- `front/`: aplicación React, TypeScript y Vite. Las imágenes y el video están en `front/public/`.
- `backend/`: API FastAPI para funciones comerciales que requieran persistencia.
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

GitHub Pages sirve el portafolio, los prototipos, el formulario de contacto por WhatsApp y el catálogo público de precios. Las tarifas visibles se mantienen en `front/public/data/pricing-services.json`; al editar ese catálogo y subir los cambios, GitHub Actions vuelve a publicar la página. No hace falta desplegar el backend para mostrar precios.

El backend contiene funciones de edición y persistencia de cotizaciones; todavía no tiene autenticación y no se debe exponer públicamente hasta proteger esas operaciones. No subas archivos `.env` ni credenciales.

## Desarrollo local

Consulta [frontend](front/README.md) y [backend](backend/README.md). Copia las plantillas `.env.example` como `.env.local` o `.env` según corresponda; esos archivos locales están excluidos de Git.
