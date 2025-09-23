from pathlib import Path
from typing import Literal

from pydantic import BaseModel


class EncryptionConfig(BaseModel):
    encrypted_sqlite_file: Path
    salt_file: Path
    check_file: Path
    salt_size: int
    compression_preset: Literal[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
