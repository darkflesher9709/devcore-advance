# Backend

API FastAPI para el portafolio y el módulo comercial de Precios. El catálogo de tarifas y las cotizaciones se guardan en SQLite (`data/pricing.sqlite3` por defecto, configurable con `DATABASE_PATH`). Las tarifas iniciales se cargan como referencias editables; no son precios de mercado garantizados.

## Requisitos y desarrollo

Python 3.14.6. Instala [uv](https://docs.astral.sh/uv/) y ejecuta:

```powershell
uv sync
uv run uvicorn portafolio_api.main:app --reload --app-dir src
```

Si ya existe el entorno `.venv` y `uv` no está en PATH:

```powershell
.\.venv\Scripts\python.exe -m uvicorn portafolio_api.main:app --reload --app-dir src
```

- Estado legado: `GET /health`
- Estado API: `GET /api/health` (el prefijo se puede cambiar con `API_PREFIX`)
- OpenAPI: `/docs`
- Configuración: `APP_NAME`, `API_PREFIX` (plantilla en `.env.example`)
- Precios: `GET/POST /api/pricing/services`, `PUT/DELETE /api/pricing/services/{id}`, `GET/POST /api/pricing/quotes`, `POST /api/pricing/quotes/calculate` y operaciones de edición/estado.
- Pruebas: `python -m pytest --basetemp .pytest-tmp`; lint: `python -m ruff check src tests`.

El frontend local (`http://localhost:5173`) está permitido por CORS. No existe autenticación en la plataforma; protege la API antes de exponerla en Internet. No se implementa envío de correo: las cotizaciones permanecen en borrador hasta que un usuario cambie su estado manualmente. No añadas secretos al frontend; utiliza variables del backend para integraciones privadas.
