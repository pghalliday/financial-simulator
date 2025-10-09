from sqlalchemy import Engine, create_engine

from financial_simulator.app.config import Config

global_db_engine: Engine | None = None


def init_db_engine(config: Config) -> None:
    global global_db_engine
    global_db_engine = create_engine("sqlite:///" + str(config.database.sqlite_file))


def get_db_engine() -> Engine:
    assert global_db_engine is not None
    return global_db_engine
