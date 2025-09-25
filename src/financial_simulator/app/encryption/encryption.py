import base64
import logging
import os
from lzma import CHECK_SHA256, FORMAT_XZ, compress, decompress
from pathlib import Path

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

logger = logging.getLogger(__name__)


def __fernet(salt: bytes, passphrase: str) -> Fernet:
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=480000)
    key = base64.urlsafe_b64encode(kdf.derive(passphrase.encode("utf-8")))
    return Fernet(key)


def check(check_file: Path, salt_file: Path, passphrase: str):
    logger.debug(f"salt file: {salt_file}")
    logger.debug(f"check file: {check_file}")
    salt = salt_file.read_bytes()
    fernet = __fernet(salt, passphrase)
    fernet.decrypt(check_file.read_bytes())


def read(encrypted_file: Path, salt_file: Path, passphrase: str) -> bytes:
    logger.debug(f"salt file: {salt_file}")
    logger.debug(f"encrypted file: {encrypted_file}")
    salt = salt_file.read_bytes()
    fernet = __fernet(salt, passphrase)
    compressed_data = fernet.decrypt(encrypted_file.read_bytes())
    return decompress(compressed_data)


def write(
    encrypted_file: Path,
    salt_file: Path,
    check_file: Path,
    salt_size: int,
    compression_preset: int,
    passphrase: str,
    data: bytes,
):
    logger.debug(f"salt file: {salt_file}")
    logger.debug(f"encrypted file: {encrypted_file}")
    logger.debug(f"check file: {check_file}")
    salt = os.urandom(salt_size)
    fernet = __fernet(salt, passphrase)
    compressed_data = compress(
        data, format=FORMAT_XZ, check=CHECK_SHA256, preset=compression_preset
    )
    encrypted_data = fernet.encrypt(compressed_data)
    encrypted_check = fernet.encrypt(os.urandom(salt_size))
    salt_file.write_bytes(salt)
    encrypted_file.write_bytes(encrypted_data)
    check_file.write_bytes(encrypted_check)
