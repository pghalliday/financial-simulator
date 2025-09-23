from argparse import Namespace

from financial_simulator.app.config import Config
from financial_simulator.app.shell import Shell


def shell(args: Namespace, config: Config):
    Shell(config).cmdloop()


def add_shell_command(subparsers):
    sub_parser = subparsers.add_parser("shell", help="Start the Financial Simulator shell")
    sub_parser.set_defaults(func=shell)
