from pathlib import Path
from typing import Sequence

from alembic.config import Config
from alembic.runtime.environment import EnvironmentContext
from alembic.runtime.migration import MigrationContext, MigrationStep
from alembic.script import ScriptDirectory
from sqlalchemy import Engine, create_engine

from .schema import Base


class Migration:
    __engine: Engine
    __config: Config
    __script_directory: ScriptDirectory
    __environment_context: EnvironmentContext

    def __init__(self, sqlite_file: Path):
        self.__engine = create_engine("sqlite:///" + str(sqlite_file))
        self.__config = Config()
        self.__config.set_main_option(
            "script_location", "financial_simulator.app.database:alembic"
        )
        self.__script_directory = ScriptDirectory.from_config(self.__config)
        self.__environment_context = EnvironmentContext(
            self.__config, self.__script_directory, as_sql=False
        )

    def migrate(self, destination: str = "head", downgrade: bool = False):
        # noinspection PyUnusedLocal
        def do_migrate(
            revision: str, context: MigrationContext
        ) -> Sequence[MigrationStep]:
            if downgrade:
                # noinspection PyProtectedMember
                return self.__script_directory._downgrade_revs(
                    destination,
                    revision,
                )
            else:
                # noinspection PyProtectedMember
                return self.__script_directory._upgrade_revs(
                    destination,
                    revision,
                )

        with self.__engine.connect() as connection:
            self.__environment_context.configure(
                connection=connection, target_metadata=Base.metadata, fn=do_migrate
            )
            with self.__environment_context.begin_transaction():
                self.__environment_context.run_migrations()
