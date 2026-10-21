from datetime import date, timedelta

import pytest
from pydantic import ValidationError

from portafolio_api.pricing import (
    QuoteInput,
    ServiceInput,
    calculate_quote,
    create_quote,
    create_service,
    initialize_database,
    list_quotes,
    list_services,
)


@pytest.fixture
def pricing_db(tmp_path, monkeypatch):
    monkeypatch.setenv("DATABASE_PATH", str(tmp_path / "pricing-test.sqlite3"))
    initialize_database()


def test_seeded_reference_catalog_and_service_creation(pricing_db):
    initial = list_services(search="", category="Todas", level="Todos", status="Todos")
    assert len(initial) >= 20
    assert initial[0]["reference_only"] is True

    saved = create_service(
        ServiceInput(
            code="TEST-01",
            name="Servicio de prueba",
            category="Desarrollo",
            level="Básico",
            min_price=100000,
            max_price=200000,
            billing_unit="por proyecto",
            estimated_cost=50000,
            target_margin=40,
        )
    )
    assert saved["reference_only"] is False
    assert saved["min_price"] == 100000


def test_quote_calculation_and_persistence(pricing_db):
    quote = QuoteInput.model_validate(
        {
            "client_name": "Cliente de prueba",
            "expires_at": date.today() + timedelta(days=15),
            "items": [
                {
                    "service_id": "service-1",
                    "name": "Desarrollo",
                    "quantity": 1,
                    "unit_price": 1000000,
                    "unit_cost": 400000,
                }
            ],
            "labor_cost": 100000,
            "discount": 50000,
            "tax_enabled": True,
            "taxable_base": 950000,
            "tax_rate": 19,
            "target_margin": 40,
        }
    )
    calculation = calculate_quote(quote)
    assert calculation["subtotal"] == 950000
    assert calculation["tax_amount"] == 180500
    assert calculation["estimated_profit"] == 450000

    created = create_quote(quote)
    assert created["total"] == 1130500
    assert len(list_quotes()) == 1


def test_quote_rejects_margin_of_one_hundred_percent():
    with pytest.raises(ValidationError):
        QuoteInput.model_validate(
            {
                "client_name": "Cliente de prueba",
                "expires_at": date.today() + timedelta(days=1),
                "items": [
                    {
                        "service_id": "service-1",
                        "name": "Desarrollo",
                        "quantity": 1,
                        "unit_price": 100000,
                        "unit_cost": 50000,
                    }
                ],
                "target_margin": 100,
            }
        )
