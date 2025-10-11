from typing import Annotated

from fastapi import Depends
from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session

from financial_simulator.app.config import Config

global_db_engine: Engine | None = None


def init_globals(config: Config) -> None:
    global global_db_engine
    db_path = config.database.sqlite_file.absolute()
    global_db_engine = create_engine("sqlite:///" + str(db_path))


def get_db_session():
    assert global_db_engine is not None
    with Session(global_db_engine) as session:
        yield session


DBSessionDependency = Annotated[Session, Depends(get_db_session)]
