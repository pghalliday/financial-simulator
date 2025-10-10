import tomllib
from pathlib import Path
from typing import Self

from pydantic import BaseModel

from .database_config import DatabaseConfig
from .encryption_config import EncryptionConfig
from .logging_config import LoggingConfig

DEFAULT_USER_CONFIG_FILE = Path.home().joinpath(".financial-simulator", "config.toml")
DEFAULT_LOCAL_CONFIG_FILE = Path("financial-simulator.toml")


class Config(BaseModel):
    database: DatabaseConfig
    encryption: EncryptionConfig
    logging: LoggingConfig

    @classmethod
    def read(cls, filename: str | None) -> Self:
        if filename is not None:
            filepath = Path(filename)
            if not filepath.is_file():
                raise Exception(f"Invalid config file path: {filepath}")
        else:
            if DEFAULT_LOCAL_CONFIG_FILE.is_file():
                filepath = DEFAULT_LOCAL_CONFIG_FILE
            elif DEFAULT_USER_CONFIG_FILE.is_file():
                filepath = DEFAULT_USER_CONFIG_FILE
            else:
                raise Exception(
                    f"No config file found at {DEFAULT_LOCAL_CONFIG_FILE} or {DEFAULT_USER_CONFIG_FILE}"
                )
        with open(filepath, "rb") as f:
            config_data = tomllib.load(f)
        return cls.model_validate(config_data)
