"""Persistent pricing catalog and quotation endpoints."""

from __future__ import annotations

import json
import os
import sqlite3
from datetime import date
from pathlib import Path
from typing import Literal
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, ConfigDict, Field, model_validator

router = APIRouter(prefix="/pricing", tags=["pricing"])
DEFAULT_DB = Path(__file__).resolve().parents[2] / "data" / "pricing.sqlite3"
HIDDEN_SERVICE_CODES = {"DB-MON", "SSL", "BACKUP", "EMAIL", "H-ARCH", "H-AUTO", "H-FIX"}


def connect() -> sqlite3.Connection:
    path = Path(os.getenv("DATABASE_PATH", str(DEFAULT_DB)))
    path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(path)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def initialize_database() -> None:
    with connect() as db:
        db.executescript(
            """
            CREATE TABLE IF NOT EXISTS services (
                id TEXT PRIMARY KEY, code TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
                category TEXT NOT NULL, level TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
                min_price INTEGER NOT NULL CHECK(min_price >= 0),
                max_price INTEGER NOT NULL CHECK(max_price >= min_price),
                billing_unit TEXT NOT NULL,
                estimated_cost INTEGER NOT NULL DEFAULT 0 CHECK(estimated_cost >= 0),
                target_margin REAL NOT NULL DEFAULT 40,
                active INTEGER NOT NULL DEFAULT 1, reference_only INTEGER NOT NULL DEFAULT 1,
                provider TEXT NOT NULL DEFAULT '', renewal_date TEXT NOT NULL DEFAULT '',
                charged_to_client INTEGER NOT NULL DEFAULT 0,
                CHECK(target_margin >= 0 AND target_margin < 100)
            );
            CREATE TABLE IF NOT EXISTS quotes (
                id TEXT PRIMARY KEY, number TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL,
                expires_at TEXT NOT NULL, client_name TEXT NOT NULL,
                tax_id TEXT NOT NULL DEFAULT '', contact TEXT NOT NULL DEFAULT '',
                scope TEXT NOT NULL DEFAULT '', deliverables TEXT NOT NULL DEFAULT '',
                eta_days INTEGER NOT NULL DEFAULT 0, estimated_hours REAL NOT NULL DEFAULT 0,
                items_json TEXT NOT NULL, labor_cost INTEGER NOT NULL DEFAULT 0,
                infrastructure_cost INTEGER NOT NULL DEFAULT 0,
                licenses_cost INTEGER NOT NULL DEFAULT 0,
                third_party_cost INTEGER NOT NULL DEFAULT 0, other_cost INTEGER NOT NULL DEFAULT 0,
                contingency_cost INTEGER NOT NULL DEFAULT 0, discount INTEGER NOT NULL DEFAULT 0,
                tax_enabled INTEGER NOT NULL DEFAULT 0, taxable_base INTEGER NOT NULL DEFAULT 0,
                tax_rate REAL NOT NULL DEFAULT 0, subtotal INTEGER NOT NULL,
                tax_amount INTEGER NOT NULL, total INTEGER NOT NULL, total_cost INTEGER NOT NULL,
                estimated_profit INTEGER NOT NULL,
                margin REAL NOT NULL, target_margin REAL NOT NULL DEFAULT 40,
                payment_terms TEXT NOT NULL DEFAULT '', warranty TEXT NOT NULL DEFAULT '',
                exclusions TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '',
                status TEXT NOT NULL DEFAULT 'Borrador'
            );
            """
        )
        service_columns = {row[1] for row in db.execute("PRAGMA table_info(services)")}
        for column, definition in {
            "provider": "TEXT NOT NULL DEFAULT ''",
            "renewal_date": "TEXT NOT NULL DEFAULT ''",
            "charged_to_client": "INTEGER NOT NULL DEFAULT 0",
        }.items():
            if column not in service_columns:
                db.execute(f"ALTER TABLE services ADD COLUMN {column} {definition}")
        quote_columns = {row[1] for row in db.execute("PRAGMA table_info(quotes)")}
        if "estimated_hours" not in quote_columns:
            db.execute("ALTER TABLE quotes ADD COLUMN estimated_hours REAL NOT NULL DEFAULT 0")
        if db.execute("SELECT COUNT(*) FROM services").fetchone()[0] == 0:
            seeds = [
                (
                    "PKG-BAS",
                    "Paquete de desarrollo Básico",
                    "Paquetes de desarrollo",
                    "Básico",
                    "Aplicación o página pequeña con alcance definido.",
                    1500000,
                    1500000,
                    "por proyecto",
                ),
                (
                    "PKG-INT",
                    "Paquete de desarrollo Intermedio",
                    "Paquetes de desarrollo",
                    "Intermedio",
                    "Aplicación empresarial con base de datos y dashboard.",
                    4000000,
                    4000000,
                    "por proyecto",
                ),
                (
                    "PKG-AVA",
                    "Paquete de desarrollo Avanzado",
                    "Paquetes de desarrollo",
                    "Avanzado",
                    "Software empresarial a medida e integraciones según alcance.",
                    8000000,
                    8000000,
                    "por proyecto",
                ),
                (
                    "DIS-UI",
                    "Diseño de interfaz",
                    "Servicios adicionales",
                    "Básico",
                    "Diseño de interfaz y experiencia de usuario.",
                    200000,
                    200000,
                    "por proyecto",
                ),
                (
                    "DB-SET",
                    "Configuración de base de datos",
                    "Servicios adicionales",
                    "Intermedio",
                    "Configuración inicial de base de datos.",
                    200000,
                    200000,
                    "por proyecto",
                ),
                (
                    "AUTH",
                    "Autenticación y usuarios",
                    "Servicios adicionales",
                    "Intermedio",
                    "Inicio de sesión y gestión básica de usuarios.",
                    200000,
                    200000,
                    "por proyecto",
                ),
                (
                    "RPT",
                    "Informes PDF o Excel",
                    "Servicios adicionales",
                    "Intermedio",
                    "Generación de informes descargables.",
                    250000,
                    250000,
                    "por proyecto",
                ),
                (
                    "DASH",
                    "Dashboard e indicadores",
                    "Servicios adicionales",
                    "Intermedio",
                    "Panel visual de indicadores.",
                    300000,
                    300000,
                    "por proyecto",
                ),
                (
                    "INT",
                    "Integraciones con plataformas",
                    "Servicios adicionales",
                    "Avanzado",
                    "Integración según alcance y proveedor.",
                    300000,
                    300000,
                    "por proyecto",
                ),
                (
                    "QA",
                    "Pruebas y despliegue",
                    "Servicios adicionales",
                    "Intermedio",
                    "Pruebas y publicación inicial.",
                    150000,
                    150000,
                    "por proyecto",
                ),
                (
                    "HOST",
                    "Hosting web básico",
                    "Infraestructura",
                    "Básico",
                    "Referencia mensual orientativa; confirmar proveedor.",
                    10000,
                    30000,
                    "por mes",
                ),
                (
                    "DOMAIN",
                    "Dominio",
                    "Infraestructura",
                    "Básico",
                    "Presupuesto anual de referencia; registrar proveedor y renovación.",
                    50000,
                    150000,
                    "por año",
                ),
                (
                    "API",
                    "Backend y API",
                    "Infraestructura",
                    "Intermedio",
                    "Referencia mensual orientativa; confirmar proveedor.",
                    30000,
                    100000,
                    "por mes",
                ),
                (
                    "DB-MON",
                    "Base de datos",
                    "Infraestructura",
                    "Intermedio",
                    "Referencia mensual orientativa; confirmar proveedor.",
                    30000,
                    100000,
                    "por mes",
                ),
                (
                    "BACKUP",
                    "Copias de seguridad",
                    "Infraestructura",
                    "Básico",
                    "Referencia mensual orientativa; confirmar proveedor.",
                    15000,
                    40000,
                    "por mes",
                ),
                (
                    "EMAIL",
                    "Correo corporativo",
                    "Infraestructura",
                    "Básico",
                    "Precio editable según proveedor y número de usuarios.",
                    0,
                    0,
                    "por mes",
                ),
                (
                    "SSL",
                    "Certificado SSL",
                    "Infraestructura",
                    "Básico",
                    "Puede ser gratuito o tener costo según proveedor.",
                    0,
                    0,
                    "por año",
                ),
                (
                    "MAINT-B",
                    "Mantenimiento Básico",
                    "Mantenimiento",
                    "Básico",
                    "Horas de soporte y alcance por configurar.",
                    150000,
                    300000,
                    "por mes",
                ),
                (
                    "MAINT-I",
                    "Mantenimiento Intermedio",
                    "Mantenimiento",
                    "Intermedio",
                    "Horas de soporte y alcance por configurar.",
                    300000,
                    700000,
                    "por mes",
                ),
                (
                    "MAINT-A",
                    "Mantenimiento Avanzado",
                    "Mantenimiento",
                    "Avanzado",
                    "Horas de soporte y alcance por configurar.",
                    700000,
                    1500000,
                    "por mes",
                ),
                (
                    "H-FIX",
                    "Correcciones menores",
                    "Tarifas por hora",
                    "Básico",
                    "Tarifa horaria de referencia.",
                    35000,
                    50000,
                    "por hora",
                ),
                (
                    "H-DEV",
                    "Desarrollo frontend o backend",
                    "Tarifas por hora",
                    "Intermedio",
                    "Tarifa horaria de referencia.",
                    45000,
                    75000,
                    "por hora",
                ),
                (
                    "H-AUTO",
                    "Automatizaciones e integraciones",
                    "Tarifas por hora",
                    "Avanzado",
                    "Tarifa horaria de referencia.",
                    60000,
                    100000,
                    "por hora",
                ),
                (
                    "H-ARCH",
                    "Arquitectura y seguridad avanzada",
                    "Tarifas por hora",
                    "Avanzado",
                    "Tarifa horaria de referencia.",
                    100000,
                    180000,
                    "por hora",
                ),
            ]
            db.executemany(
                "INSERT INTO services (id,code,name,category,level,description,min_price,max_price,"
                "billing_unit,estimated_cost,target_margin,active,reference_only) "
                "VALUES (?,?,?,?,?,?,?,?,?,0,40,1,1)",
                [(str(uuid4()), *seed) for seed in seeds],
            )
        # Add the later infrastructure reference rows to databases created by an older version.
        for seed in (
            (
                "DOMAIN",
                "Dominio",
                "Infraestructura",
                "Básico",
                "Presupuesto anual de referencia; registrar proveedor y renovación.",
                50000,
                150000,
                "por año",
            ),
            (
                "EMAIL",
                "Correo corporativo",
                "Infraestructura",
                "Básico",
                "Precio editable según proveedor y número de usuarios.",
                0,
                0,
                "por mes",
            ),
            (
                "SSL",
                "Certificado SSL",
                "Infraestructura",
                "Básico",
                "Puede ser gratuito o tener costo según proveedor.",
                0,
                0,
                "por año",
            ),
            (
                "AI-BAS",
                "Clase de IA Básico",
                "Clases de IA",
                "Básico",
                "Clase introductoria de inteligencia artificial, tarifa por hora.",
                80000,
                80000,
                "por hora",
            ),
            (
                "AI-INT",
                "Clase de IA Intermedio",
                "Clases de IA",
                "Intermedio",
                "Clase de nivel intermedio de inteligencia artificial, tarifa por hora.",
                120000,
                120000,
                "por hora",
            ),
            (
                "AI-AVA",
                "Clase de IA Avanzado",
                "Clases de IA",
                "Avanzado",
                "Clase avanzada de inteligencia artificial, tarifa por hora.",
                160000,
                160000,
                "por hora",
            ),
        ):
            db.execute(
                "INSERT OR IGNORE INTO services "
                "(id,code,name,category,level,description,min_price,max_price,billing_unit,"
                "estimated_cost,target_margin,active,reference_only) "
                "VALUES (?,?,?,?,?,?,?,?,?,0,40,1,1)",
                (str(uuid4()), *seed),
            )


class ServiceInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    code: str = Field(min_length=2, max_length=30)
    name: str = Field(min_length=2, max_length=120)
    category: str = Field(min_length=2, max_length=80)
    level: Literal["Básico", "Intermedio", "Avanzado"]
    description: str = Field(default="", max_length=1000)
    min_price: int = Field(ge=0)
    max_price: int = Field(ge=0)
    billing_unit: Literal["por proyecto", "por hora", "por mes", "por año"]
    estimated_cost: int = Field(default=0, ge=0)
    target_margin: float = Field(default=40, ge=0, lt=100)
    provider: str = Field(default="", max_length=120)
    renewal_date: str = Field(default="", max_length=20)
    charged_to_client: bool = False
    active: bool = True

    @model_validator(mode="after")
    def prices_in_order(self) -> ServiceInput:
        if self.max_price < self.min_price:
            raise ValueError("El precio máximo no puede ser menor al mínimo.")
        return self


class QuoteItem(BaseModel):
    service_id: str
    name: str = Field(min_length=1, max_length=120)
    description: str = Field(default="", max_length=500)
    quantity: float = Field(gt=0, le=10000)
    unit_price: int = Field(ge=0)
    unit_cost: int = Field(default=0, ge=0)


class QuoteInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    client_name: str = Field(min_length=2, max_length=160)
    tax_id: str = Field(default="", max_length=40)
    contact: str = Field(default="", max_length=160)
    expires_at: date
    scope: str = Field(default="", max_length=5000)
    deliverables: str = Field(default="", max_length=3000)
    eta_days: int = Field(default=0, ge=0, le=3650)
    estimated_hours: float = Field(default=0, ge=0, le=100000)
    items: list[QuoteItem] = Field(min_length=1, max_length=100)
    labor_cost: int = Field(default=0, ge=0)
    infrastructure_cost: int = Field(default=0, ge=0)
    licenses_cost: int = Field(default=0, ge=0)
    third_party_cost: int = Field(default=0, ge=0)
    other_cost: int = Field(default=0, ge=0)
    contingency_cost: int = Field(default=0, ge=0)
    discount: int = Field(default=0, ge=0)
    tax_enabled: bool = False
    taxable_base: int = Field(default=0, ge=0)
    tax_rate: float = Field(default=0, ge=0, le=100)
    target_margin: float = Field(default=40, ge=0, lt=100)
    payment_terms: str = Field(default="", max_length=2000)
    warranty: str = Field(default="", max_length=2000)
    exclusions: str = Field(default="", max_length=3000)
    notes: str = Field(default="", max_length=3000)
    status: Literal["Borrador", "En negociación", "Aceptada", "Rechazada", "Vencida"] = "Borrador"


def service_dict(row: sqlite3.Row) -> dict[str, object]:
    result = dict(row)
    result["active"] = bool(result["active"])
    result["reference_only"] = bool(result["reference_only"])
    result["charged_to_client"] = bool(result["charged_to_client"])
    return result


def quote_dict(row: sqlite3.Row) -> dict[str, object]:
    result = dict(row)
    result["items"] = json.loads(result.pop("items_json"))
    result["tax_enabled"] = bool(result["tax_enabled"])
    return result


@router.get("/services")
def list_services(
    search: str = Query(default="", max_length=100),
    category: str = "Todas",
    level: str = "Todos",
    status: str = "Todos",
) -> list[dict[str, object]]:
    with connect() as db:
        rows = db.execute("SELECT * FROM services ORDER BY category,name").fetchall()
    items = [service_dict(row) for row in rows]
    q = search.casefold()
    return [
        item
        for item in items
        if item["code"] not in HIDDEN_SERVICE_CODES
        and (not q or q in f"{item['code']} {item['name']} {item['description']}".casefold())
        and (category == "Todas" or item["category"] == category)
        and (level == "Todos" or item["level"] == level)
        and (status == "Todos" or (item["active"] if status == "Activos" else not item["active"]))
    ]


@router.post("/services", status_code=201)
def create_service(data: ServiceInput) -> dict[str, object]:
    service_id = str(uuid4())
    try:
        with connect() as db:
            db.execute(
                "INSERT INTO services (id,code,name,category,level,description,min_price,max_price,"
                "billing_unit,estimated_cost,target_margin,active,reference_only,provider,renewal_date,"
                "charged_to_client) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,0,?,?,?)",
                (
                    service_id,
                    data.code,
                    data.name,
                    data.category,
                    data.level,
                    data.description,
                    data.min_price,
                    data.max_price,
                    data.billing_unit,
                    data.estimated_cost,
                    data.target_margin,
                    int(data.active),
                    data.provider,
                    data.renewal_date,
                    int(data.charged_to_client),
                ),
            )
            row = db.execute("SELECT * FROM services WHERE id=?", (service_id,)).fetchone()
    except sqlite3.IntegrityError as error:
        raise HTTPException(409, "El código de servicio ya existe.") from error
    return service_dict(row)


@router.put("/services/{service_id}")
def update_service(service_id: str, data: ServiceInput) -> dict[str, object]:
    try:
        with connect() as db:
            cursor = db.execute(
                "UPDATE services SET code=?,name=?,category=?,level=?,description=?,min_price=?,"
                "max_price=?,billing_unit=?,estimated_cost=?,target_margin=?,active=?,provider=?,"
                "renewal_date=?,charged_to_client=?,reference_only=0 WHERE id=?",
                (
                    data.code,
                    data.name,
                    data.category,
                    data.level,
                    data.description,
                    data.min_price,
                    data.max_price,
                    data.billing_unit,
                    data.estimated_cost,
                    data.target_margin,
                    int(data.active),
                    data.provider,
                    data.renewal_date,
                    int(data.charged_to_client),
                    service_id,
                ),
            )
            if cursor.rowcount == 0:
                raise HTTPException(404, "Servicio no encontrado.")
            row = db.execute("SELECT * FROM services WHERE id=?", (service_id,)).fetchone()
    except sqlite3.IntegrityError as error:
        raise HTTPException(409, "El código de servicio ya existe.") from error
    return service_dict(row)


@router.delete("/services/{service_id}", status_code=204)
def deactivate_service(service_id: str) -> None:
    with connect() as db:
        cursor = db.execute("UPDATE services SET active=0 WHERE id=?", (service_id,))
        if cursor.rowcount == 0:
            raise HTTPException(404, "Servicio no encontrado.")


def calculate_quote(data: QuoteInput) -> dict[str, int | float]:
    line_subtotal = sum(round(item.quantity * item.unit_price) for item in data.items)
    subtotal = max(0, line_subtotal - data.discount)
    other_costs = (
        data.labor_cost
        + data.infrastructure_cost
        + data.licenses_cost
        + data.third_party_cost
        + data.other_cost
        + data.contingency_cost
    )
    line_costs = sum(round(item.quantity * item.unit_cost) for item in data.items)
    total_cost = other_costs + line_costs
    tax_base = min(data.taxable_base, subtotal) if data.tax_enabled else 0
    tax_amount = round(tax_base * data.tax_rate / 100)
    total = subtotal + tax_amount
    profit = subtotal - total_cost
    margin = round((profit / subtotal * 100), 2) if subtotal else 0
    return {
        "subtotal": subtotal,
        "tax_amount": tax_amount,
        "total": total,
        "total_cost": total_cost,
        "estimated_profit": profit,
        "margin": margin,
        "target_price": round(total_cost / (1 - data.target_margin / 100))
        if data.target_margin < 100
        else 0,
    }


@router.post("/quotes/calculate")
def preview_quote(data: QuoteInput) -> dict[str, int | float | str]:
    return {
        **calculate_quote(data),
        "tax_notice": "Verifica con contabilidad la base y tarifa aplicable antes de emitir.",
    }


@router.get("/quotes")
def list_quotes() -> list[dict[str, object]]:
    with connect() as db:
        return [
            quote_dict(row)
            for row in db.execute("SELECT * FROM quotes ORDER BY created_at DESC").fetchall()
        ]


@router.post("/quotes", status_code=201)
def create_quote(data: QuoteInput) -> dict[str, object]:
    today = date.today()
    if data.expires_at < today:
        raise HTTPException(422, "La fecha de vencimiento debe ser hoy o posterior.")
    computed = calculate_quote(data)
    quote_id = str(uuid4())
    with connect() as db:
        count = db.execute(
            "SELECT COUNT(*) FROM quotes WHERE created_at LIKE ?",
            (today.isoformat() + "%",),
        ).fetchone()[0]
        number = f"COT-{today:%Y%m%d}-{count + 1:03d}"
        values = (
            quote_id,
            number,
            today.isoformat(),
            data.expires_at.isoformat(),
            data.client_name,
            data.tax_id,
            data.contact,
            data.scope,
            data.deliverables,
            data.eta_days,
            data.estimated_hours,
            json.dumps([item.model_dump() for item in data.items], ensure_ascii=False),
            data.labor_cost,
            data.infrastructure_cost,
            data.licenses_cost,
            data.third_party_cost,
            data.other_cost,
            data.contingency_cost,
            data.discount,
            int(data.tax_enabled),
            data.taxable_base,
            data.tax_rate,
            computed["subtotal"],
            computed["tax_amount"],
            computed["total"],
            computed["total_cost"],
            computed["estimated_profit"],
            computed["margin"],
            data.target_margin,
            data.payment_terms,
            data.warranty,
            data.exclusions,
            data.notes,
            data.status,
        )
        columns = (
            "id,number,created_at,expires_at,client_name,tax_id,contact,scope,deliverables,"
            "eta_days,estimated_hours,items_json,labor_cost,infrastructure_cost,licenses_cost,"
            "third_party_cost,other_cost,contingency_cost,discount,tax_enabled,taxable_base,"
            "tax_rate,subtotal,tax_amount,total,total_cost,estimated_profit,margin,target_margin,"
            "payment_terms,warranty,exclusions,notes,status"
        )
        db.execute(
            f"INSERT INTO quotes ({columns}) VALUES ({','.join('?' for _ in values)})", values
        )
        row = db.execute("SELECT * FROM quotes WHERE id=?", (quote_id,)).fetchone()
    return quote_dict(row)


@router.put("/quotes/{quote_id}")
def replace_quote(quote_id: str, data: QuoteInput) -> dict[str, object]:
    if data.expires_at < date.today():
        raise HTTPException(422, "La fecha de vencimiento debe ser hoy o posterior.")
    computed = calculate_quote(data)
    with connect() as db:
        values = (
            data.expires_at.isoformat(),
            data.client_name,
            data.tax_id,
            data.contact,
            data.scope,
            data.deliverables,
            data.eta_days,
            data.estimated_hours,
            json.dumps([item.model_dump() for item in data.items], ensure_ascii=False),
            data.labor_cost,
            data.infrastructure_cost,
            data.licenses_cost,
            data.third_party_cost,
            data.other_cost,
            data.contingency_cost,
            data.discount,
            int(data.tax_enabled),
            data.taxable_base,
            data.tax_rate,
            computed["subtotal"],
            computed["tax_amount"],
            computed["total"],
            computed["total_cost"],
            computed["estimated_profit"],
            computed["margin"],
            data.target_margin,
            data.payment_terms,
            data.warranty,
            data.exclusions,
            data.notes,
            data.status,
            quote_id,
        )
        cursor = db.execute(
            "UPDATE quotes SET expires_at=?,client_name=?,tax_id=?,contact=?,scope=?,"
            "deliverables=?,eta_days=?,estimated_hours=?,items_json=?,labor_cost=?,"
            "infrastructure_cost=?,licenses_cost=?,third_party_cost=?,"
            "other_cost=?,contingency_cost=?,discount=?,tax_enabled=?,taxable_base=?,tax_rate=?,subtotal=?,"
            "tax_amount=?,total=?,total_cost=?,estimated_profit=?,margin=?,target_margin=?,payment_terms=?,"
            "warranty=?,exclusions=?,notes=?,status=? WHERE id=?",
            values,
        )
        if cursor.rowcount == 0:
            raise HTTPException(404, "Cotización no encontrada.")
        return quote_dict(db.execute("SELECT * FROM quotes WHERE id=?", (quote_id,)).fetchone())


@router.put("/quotes/{quote_id}/status")
def update_quote_status(
    quote_id: str, status: Literal["Borrador", "En negociación", "Aceptada", "Rechazada", "Vencida"]
) -> dict[str, object]:
    with connect() as db:
        cursor = db.execute("UPDATE quotes SET status=? WHERE id=?", (status, quote_id))
        if cursor.rowcount == 0:
            raise HTTPException(404, "Cotización no encontrada.")
        return quote_dict(db.execute("SELECT * FROM quotes WHERE id=?", (quote_id,)).fetchone())


@router.delete("/quotes/{quote_id}", status_code=204)
def delete_quote(quote_id: str) -> None:
    with connect() as db:
        cursor = db.execute("DELETE FROM quotes WHERE id=?", (quote_id,))
        if cursor.rowcount == 0:
            raise HTTPException(404, "Cotización no encontrada.")
