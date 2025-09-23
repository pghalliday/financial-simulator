from pathlib import Path
from typing import Literal

from pydantic import BaseModel


class DatabaseConfig(BaseModel):
    sqlite_file: Path
    sqlalchemy_log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
