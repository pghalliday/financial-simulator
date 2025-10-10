from argparse import Namespace
from typing import Any  # type: ignore

from financial_simulator.app.config import Config
from financial_simulator.app.database import Migration


def init(args: Namespace, config: Config):
    sqlite_file = config.database.sqlite_file
    if not args.overwrite:
        if sqlite_file.exists():
            overwrite = (
                input(f"Overwrite SQLite database file at {sqlite_file}? (y/N): ")
                or "n"
            )
            if overwrite.lower() != "y":
                return
    migration = Migration(sqlite_file)
    if args.revision:
        migration.migrate(args.revision)
    else:
        migration.migrate()


def add_init_command(subparsers: Any):
    sub_parser = subparsers.add_parser(
        "init", help="Initialize or migrate an SQLite database file"
    )
    sub_parser.add_argument(
        "-o",
        "--overwrite",
        help="Overwrite any existing SQLite database file",
        action="store_true",
    )
    sub_parser.add_argument(
        "-r",
        "--revision",
        help="Revision to migrate the SQLite database file to",
    )
    sub_parser.add_argument(
        "-d",
        "--downgrade",
        help="The downgrade flag must be set if the target revision should result in a downgrade",
        action="store_true",
    )
    sub_parser.set_defaults(func=init)
