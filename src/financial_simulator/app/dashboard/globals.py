from financial_simulator.app.api import API

global_api: API | None = None


def set_api(api: API) -> None:
    global global_api
    global_api = api


def get_api() -> API:
    assert global_api is not None
    return global_api
