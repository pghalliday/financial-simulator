import logging
import readline
from cmd import Cmd
from typing import Generator
from uuid import UUID

from financial_simulator.app.api import API
from financial_simulator.app.config import Config
from financial_simulator.app.database import Migration
from financial_simulator.app.database.schema import Entity, Scenario
from financial_simulator.app.encryption import check, read, write
from financial_simulator.app.passphrase import confirm_passphrase, get_passphrase

logger = logging.getLogger(__name__)


def input_no_history(prompt: str) -> str:
    text = input(prompt)
    readline.remove_history_item(readline.get_current_history_length() - 1)
    return text


def parse_string_list(
    arg: str, allow_none: bool = False
) -> Generator[str | None, None, None]:
    names = arg.strip()
    if names == "":
        if allow_none:
            yield None
    else:
        string_list = names.split(",")
        for string in string_list:
            yield string.strip()


def parse_int_list(
    arg: str, allow_none: bool = False
) -> Generator[int | None, None, None]:
    string_ints = arg.strip()
    if string_ints == "":
        if allow_none:
            yield None
    else:
        string_int_list = string_ints.split(",")
        for string_int in string_int_list:
            string_int = string_int.strip()
            yield int(string_int)


class Shell(Cmd):
    intro = (
        "Welcome to the Financial Simulator shell.   Type help or ? to list commands.\n"
    )
    prompt = "(FinSim) "
    config: Config
    passphrase: str
    api: API

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
        migration = Migration(config.database.sqlite_file)
        migration.migrate()
        self.api = API(config)

    def onecmd(self, line: str):
        try:
            return super().onecmd(line)
        except Exception as e:
            print(e)
            return False

    def __check_passphrase(self):
        check(
            check_file=self.config.encryption.check_file,
            salt_file=self.config.encryption.salt_file,
            passphrase=self.passphrase,
        )

    def __decrypt_sqlite_file(self):
        self.config.database.sqlite_file.write_bytes(
            read(
                encrypted_file=self.config.encryption.encrypted_sqlite_file,
                salt_file=self.config.encryption.salt_file,
                passphrase=self.passphrase,
            )
        )

    def __encrypt_sqlite_file(self):
        write(
            encrypted_file=self.config.encryption.encrypted_sqlite_file,
            salt_file=self.config.encryption.salt_file,
            check_file=self.config.encryption.check_file,
            salt_size=self.config.encryption.salt_size,
            compression_preset=self.config.encryption.compression_preset,
            passphrase=self.passphrase,
            data=self.config.database.sqlite_file.read_bytes(),
        )

    def do_decrypt(self, arg: str):
        """Decrypt the encrypted SQLite file:  DECRYPT"""
        sqlite_file = self.config.database.sqlite_file
        if sqlite_file.exists():
            overwrite = (
                input_no_history(f"Overwrite SQLite file at {sqlite_file}? (y/N): ")
                or "n"
            )
            if overwrite.lower() != "y":
                return
        sqlite_file.write_bytes(
            read(
                encrypted_file=self.config.encryption.encrypted_sqlite_file,
                salt_file=self.config.encryption.salt_file,
                passphrase=self.passphrase,
            )
        )

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
        encrypt_and_delete = (
            input_no_history(
                f"Encrypt and delete SQLite file at {sqlite_file}? (Y/n): "
            )
            or "y"
        )
        if encrypt_and_delete.lower() == "y":
            self.__encrypt_sqlite_file()
            sqlite_file.unlink()
        return True

    def do_fquit(self, arg: str) -> bool:
        """Quit the Financial Simulator shell without encrypting and deleting the SQLite file:  FQUIT"""
        return True

    def do_insert_scenario(self, arg: str):
        """Insert a scenario:  INSERT_SCENARIO"""
        name = input_no_history("name: ")
        description = input_no_history("description: ")
        print(self.api.insert_scenario(Scenario(name=name, description=description)))

    def do_delete_scenario(self, arg: str):
        """Delete a scenario:  DELETE_SCENARIO SCENARIO_ID"""
        scenario = self.api.get_scenario(UUID(arg.strip()))
        self.api.delete_scenario(scenario)
        print(scenario)

    def do_list_scenarios(self, arg: str):
        """List the scenarios:  LIST_SCENARIOS"""
        scenarios = self.api.list_scenarios()
        for scenario in scenarios:
            print(scenario)
        print(f"count: {len(scenarios)}")

    def do_get_entities(self, arg: str):
        """Get the entity included in a scenario:  GET_ENTITIES SCENARIO_ID"""
        scenario_entities = self.api.get_entities(UUID(arg.strip()))
        for entity in scenario_entities:
            print(entity)
        print(f"count: {len(scenario_entities)}")

    def do_insert_entity(self, arg: str):
        """Insert an entity:  INSERT_ENTITY"""
        name = input_no_history("name: ")
        description = input_no_history("description: ")
        print(self.api.insert_entity(Entity(name=name, description=description)))

    def do_delete_entity(self, arg: str):
        """Delete an entity:  DELETE_ENTITY ENTITY_ID"""
        entity = self.api.get_entity(UUID(arg.strip()))
        self.api.delete_entity(entity)
        print(entity)

    def do_list_entities(self, arg: str):
        """List the entity:  LIST_ENTITIES"""
        entities = self.api.list_entities()
        for entity in entities:
            print(entity)
        print(f"count: {len(entities)}")

    def do_get_scenarios(self, arg: str):
        """Get the scenarios that include an entity:  GET_SCENARIOS ENTITY_ID"""
        entity_scenarios = self.api.get_scenarios(UUID(arg.strip()))
        for scenario in entity_scenarios:
            print(scenario)
        print(f"count: {len(entity_scenarios)}")

    def do_add_entity_to_scenario(self, arg: str):
        """Add an entity to a scenario:  ADD_ENTITY_TO_SCENARIO SCENARIO_ID ENTITY_ID"""
        ids = arg.split()
        assert len(ids) == 2
        scenario_id = UUID(ids[0])
        entity_id = UUID(ids[1])
        scenario, entity = self.api.add_entity_to_scenario(scenario_id, entity_id)
        print(scenario)
        print(entity)

    def do_remove_entity_from_scenario(self, arg: str):
        """Remove an entity from a scenario:  REMOVE_ENTITY_FROM_SCENARIO SCENARIO_ID ENTITY_ID"""
        ids = arg.split()
        assert len(ids) == 2
        scenario_id = UUID(ids[0])
        entity_id = UUID(ids[1])
        scenario, entity = self.api.remove_entity_from_scenario(scenario_id, entity_id)
        print(scenario)
        print(entity)
