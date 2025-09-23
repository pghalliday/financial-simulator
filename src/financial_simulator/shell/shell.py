import logging
import readline
from cmd import Cmd
from typing import Generator

from sqlalchemy import create_engine, Engine

from financial_simulator.config import Config
from financial_simulator.database import Migration
from financial_simulator.encryption import read, write, check
from ..passphrase import get_passphrase, confirm_passphrase

logger = logging.getLogger(__name__)


def input_no_history(prompt: str) -> str:
    text = input(prompt)
    readline.remove_history_item(readline.get_current_history_length() - 1)
    return text


def parse_string_list(arg: str, allow_none: bool = False) -> Generator[str | None, None, None]:
    names = arg.strip()
    if names == '':
        if allow_none:
            yield None
    else:
        string_list = names.split(',')
        for string in string_list:
            yield string.strip()


def parse_int_list(arg: str, allow_none: bool = False) -> Generator[int | None, None, None]:
    string_ints = arg.strip()
    if string_ints == '':
        if allow_none:
            yield None
    else:
        string_int_list = string_ints.split(',')
        for string_int in string_int_list:
            string_int = string_int.strip()
            yield int(string_int)


class Shell(Cmd):
    intro = 'Welcome to the Financial Simulator shell.   Type help or ? to list commands.\n'
    prompt = '(FinSim) '
    config: Config
    passphrase: str
    engine: Engine
    migration: Migration

    def __init__(self, config: Config):
        super().__init__()
        self.config = config
        self.passphrase = get_passphrase()
        encrypted_sqlite_file = self.config.encryption.encrypted_sqlite_file
        sqlite_file = self.config.database.sqlite_file
        if encrypted_sqlite_file.exists():
            if sqlite_file.exists():
                self.__check_passphrase()
            else:
                self.__decrypt_sqlite_file()
        else:
            confirm_passphrase(self.passphrase)
        self.engine = create_engine(f'sqlite:///{sqlite_file}')
        self.migration = Migration(self.engine)
        self.migration.upgrade_database()

    def onecmd(self, line):
        try:
            return super().onecmd(line)
        except Exception as e:
            print(e)
            return False

    def __check_passphrase(self):
        check(check_file=self.config.encryption.check_file,
              salt_file=self.config.encryption.salt_file,
              passphrase=self.passphrase)

    def __decrypt_sqlite_file(self):
        self.config.database.sqlite_file.write_bytes(read(encrypted_file=self.config.encryption.encrypted_sqlite_file,
                                                          salt_file=self.config.encryption.salt_file,
                                                          passphrase=self.passphrase))

    def __encrypt_sqlite_file(self):
        write(encrypted_file=self.config.encryption.encrypted_sqlite_file,
              salt_file=self.config.encryption.salt_file,
              check_file=self.config.encryption.check_file,
              salt_size=self.config.encryption.salt_size,
              compression_preset=self.config.encryption.compression_preset,
              passphrase=self.passphrase,
              data=self.config.database.sqlite_file.read_bytes())

    def do_decrypt(self, arg: str):
        """Decrypt the encrypted SQLite file:  DECRYPT"""
        sqlite_file = self.config.database.sqlite_file
        if sqlite_file.exists():
            overwrite = input_no_history(f'Overwrite SQLite file at {sqlite_file}? (y/N): ') or 'n'
            if overwrite.lower() != 'y':
                return
        sqlite_file.write_bytes(read(encrypted_file=self.config.encryption.encrypted_sqlite_file,
                                     salt_file=self.config.encryption.salt_file,
                                     passphrase=self.passphrase))

    def do_encrypt(self, arg: str):
        """Encrypt the SQLite file:  ENCRYPT"""
        self.__encrypt_sqlite_file()

    def do_passphrase(self, arg: str):
        """Change the passphrase and re-encrypt the SQLite file:  PASSPHRASE"""
        passphrase = get_passphrase()
        confirm_passphrase(passphrase)
        self.passphrase = passphrase
        self.__encrypt_sqlite_file()

    def do_quit(self, arg: str) -> bool:
        """Quit the Financial Simulator shell:  QUIT"""
        sqlite_file = self.config.database.sqlite_file
        encrypt_and_delete = input_no_history(f'Encrypt and delete SQLite file at {sqlite_file}? (Y/n): ') or 'y'
        if encrypt_and_delete.lower() == 'y':
            self.__encrypt_sqlite_file()
            sqlite_file.unlink()
        return True

    def do_fquit(self, arg: str) -> bool:
        """Quit the Financial Simulator shell without encrypting and deleting the SQLite file:  FQUIT"""
        return True
