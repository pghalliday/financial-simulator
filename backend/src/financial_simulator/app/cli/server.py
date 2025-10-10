from argparse import Namespace
from typing import Any

from financial_simulator.app.config import Config
from financial_simulator.app.server import start_server


def server(args: Namespace, config: Config):
    start_server(config)


def add_server_command(subparsers: Any):
    sub_parser = subparsers.add_parser(
        "server", help="Start the Financial Simulator server"
    )
    sub_parser.set_defaults(func=server)
