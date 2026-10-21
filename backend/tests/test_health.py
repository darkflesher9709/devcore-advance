from portafolio_api.main import api_health_check, app, health_check


def test_legacy_health_check() -> None:
    assert health_check() == {"status": "ok"}


def test_api_health_check() -> None:
    assert api_health_check() == {"status": "ok"}


def test_api_docs_are_available() -> None:
    assert "/api/health" in app.openapi()["paths"]
    assert "/health" in app.openapi()["paths"]
