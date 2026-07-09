def test_mock_login_creates_user_on_first_call(client) -> None:
    response = client.post("/api/v1/auth/mock-login", json={"role": "USER"})

    assert response.status_code == 200
    body = response.json()["data"]
    assert body["nickname"] == "김민수"
    assert body["role"] == "USER"
    assert body["user_id"]


def test_mock_login_returns_same_user_on_repeated_calls(client) -> None:
    first = client.post("/api/v1/auth/mock-login", json={"role": "USER"})
    second = client.post("/api/v1/auth/mock-login", json={"role": "USER"})

    assert first.json()["data"]["user_id"] == second.json()["data"]["user_id"]


def test_mock_login_defaults_to_user_role(client) -> None:
    response = client.post("/api/v1/auth/mock-login", json={})

    assert response.status_code == 200
    assert response.json()["data"]["role"] == "USER"


def test_mock_login_merchant_role_returns_different_user(client) -> None:
    user_response = client.post("/api/v1/auth/mock-login", json={"role": "USER"})
    merchant_response = client.post("/api/v1/auth/mock-login", json={"role": "MERCHANT"})

    assert (
        user_response.json()["data"]["user_id"]
        != merchant_response.json()["data"]["user_id"]
    )
    assert merchant_response.json()["data"]["nickname"] == "박영희"
