import os
from typing import Annotated
from pathlib import Path

from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from .server import SQLITE_FILE_ENV_VAR

db_path = Path(os.environ.get(SQLITE_FILE_ENV_VAR)).absolute()
db_engine = create_engine("sqlite:///" + str(db_path))

def get_db_session():
    with Session(db_engine) as session:
        yield session

DBSessionDependency = Annotated[Session, Depends(get_db_session)]
