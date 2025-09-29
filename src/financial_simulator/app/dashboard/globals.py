from sqlalchemy import Engine, create_engine

from financial_simulator.app.api import API
from financial_simulator.app.config import Config

global_api: API | None = None
global_engine: Engine | None = None


def init_engine(config: Config) -> None:
    global global_engine
    global_engine = create_engine("sqlite:///" + str(config.database.sqlite_file))


def get_engine() -> Engine:
    assert global_engine is not None
    return global_engine


def init_api(config: Config) -> None:
    global global_api
    global_api = API(config)


def get_api() -> API:
    assert global_api is not None
    return global_api
