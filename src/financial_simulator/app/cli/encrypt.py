from argparse import Namespace
from typing import Any

from financial_simulator.app.config import Config
from financial_simulator.app.encryption import write
from financial_simulator.app.passphrase import confirm_passphrase, get_passphrase


def encrypt(args: Namespace, config: Config):
    sqlite_file = config.database.sqlite_file
    passphrase = get_passphrase()
    confirm_passphrase(passphrase)
    write(
        encrypted_file=config.encryption.encrypted_sqlite_file,
        salt_file=config.encryption.salt_file,
        check_file=config.encryption.check_file,
        salt_size=config.encryption.salt_size,
        compression_preset=config.encryption.compression_preset,
        passphrase=passphrase,
        data=sqlite_file.read_bytes(),
    )
    if args.delete:
        sqlite_file.unlink()


def add_encrypt_command(subparsers: Any):
    sub_parser = subparsers.add_parser(
        "encrypt", help="Encrypt an SQLite database file"
    )
    sub_parser.add_argument(
        "-d",
        "--delete",
        help="Delete the SQLite database file after encryption",
        action="store_true",
    )
    sub_parser.set_defaults(func=encrypt)
