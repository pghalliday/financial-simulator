import tomllib
from pathlib import Path
from typing import Self

from pydantic import BaseModel

from .database_config import DatabaseConfig
from .encryption_config import EncryptionConfig
from .logging_config import LoggingConfig

DEFAULT_USER_CONFIG_FILE = Path.home().joinpath('.financial-simulator', 'config.toml')
DEFAULT_LOCAL_CONFIG_FILE = Path('financial-simulator.toml')


class Config(BaseModel):
    database: DatabaseConfig
    encryption: EncryptionConfig
    logging: LoggingConfig

    @classmethod
    def read(cls, path: str | None) -> Self:
        if path is not None:
            path = Path(path)
            if not path.is_file():
                raise Exception(f"Invalid config file path: {path}")
        else:
            if DEFAULT_LOCAL_CONFIG_FILE.is_file():
                path = DEFAULT_LOCAL_CONFIG_FILE
            elif DEFAULT_USER_CONFIG_FILE.is_file():
                path = DEFAULT_USER_CONFIG_FILE
            else:
                raise Exception(f"No config file found at {DEFAULT_LOCAL_CONFIG_FILE} or {DEFAULT_USER_CONFIG_FILE}")
        with open(path, "rb") as f:
            config_data = tomllib.load(f)
        return cls.model_validate(config_data)
