import logging
from argparse import ArgumentParser

from financial_simulator.app.config import Config

from .dashboard import add_dashboard_command
from .decrypt import add_decrypt_command
from .encrypt import add_encrypt_command
from .shell import add_shell_command

logger = logging.getLogger(__name__)

LOGGING_FORMAT = "%(levelname)s: %(name)s: %(funcName)s: %(message)s"


def cli():
    parser = ArgumentParser(
        prog="financial-simulator", description="Financial Simulator", epilog="Enjoy!"
    )
    parser.set_defaults(func=None)
    parser.add_argument("-c", "--config", help="Path to the config file")
    sub_parsers = parser.add_subparsers(title="subcommands")
    add_encrypt_command(sub_parsers)
    add_decrypt_command(sub_parsers)
    add_shell_command(sub_parsers)
    add_dashboard_command(sub_parsers)
    args = parser.parse_args()
    if args.func is None:
        parser.print_help()
    else:
        config = Config.read(args.config)
        logging.basicConfig(level=config.logging.level, format=LOGGING_FORMAT)
        logging.getLogger("sqlalchemy.engine").setLevel(
            config.database.sqlalchemy_log_level
        )
        args.func(args, config)
