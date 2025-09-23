from alembic.config import Config
from alembic.runtime.environment import EnvironmentContext
from alembic.runtime.migration import MigrationContext, MigrationStep
from alembic.script import ScriptDirectory
from sqlalchemy import Engine

from .schema import Base


class Migration:
    __engine: Engine
    __config: Config
    __script_directory: ScriptDirectory
    __environment_context: EnvironmentContext

    def __init__(self, engine: Engine):
        self.__engine = engine
        self.__config = Config()
        self.__config.set_main_option("script_location", "financial_simulator.app.database:alembic")
        self.__script_directory = ScriptDirectory.from_config(self.__config)
        self.__environment_context = EnvironmentContext(self.__config,
                                                        self.__script_directory,
                                                        as_sql=False)

    def upgrade_database(self):
        def do_upgrade(revision: str | list[str] | tuple[str, ...], context: MigrationContext) -> list[MigrationStep]:
            return self.__script_directory._upgrade_revs(
                "head",
                revision,
            )

        with self.__engine.connect() as connection:
            self.__environment_context.configure(connection=connection,
                                                 target_metadata=Base.metadata,
                                                 fn=do_upgrade)
            with self.__environment_context.begin_transaction():
                self.__environment_context.run_migrations()
