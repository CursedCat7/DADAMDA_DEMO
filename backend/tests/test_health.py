from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check_returns_success_envelope() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    body = response.json()
    assert body == {"success": True, "data": {"status": "up"}, "message": "OK"}


def test_unknown_route_returns_error_envelope() -> None:
    response = client.get("/does-not-exist")

    assert response.status_code == 404
    body = response.json()
    assert body["success"] is False
