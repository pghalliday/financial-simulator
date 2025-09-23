from argparse import Namespace

from financial_simulator.config import Config
from financial_simulator.encryption import read
from financial_simulator.passphrase import get_passphrase


def decrypt(args: Namespace, config: Config):
    sqlite_file = config.database.sqlite_file
    if not args.overwrite:
        if sqlite_file.exists():
            overwrite = input(f'Overwrite SQLite database file at {sqlite_file}? (y/N): ') or 'n'
            if overwrite.lower() != 'y':
                return
    passphrase = get_passphrase()
    sqlite_file.write_bytes(read(encrypted_file=config.encryption.encrypted_sqlite_file,
                                 salt_file=config.encryption.salt_file,
                                 passphrase=passphrase))


def add_decrypt_command(subparsers):
    sub_parser = subparsers.add_parser("decrypt", help="Decrypt sqlite database file")
    sub_parser.add_argument("-o",
                            "--overwrite",
                            help="Overwrite any existing SQLite database file",
                            action="store_true")
    sub_parser.set_defaults(func=decrypt)
