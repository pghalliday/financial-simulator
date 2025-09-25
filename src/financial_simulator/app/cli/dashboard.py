from argparse import Namespace
from typing import Any

from financial_simulator.app.config import Config
from financial_simulator.app.dashboard import start_dashboard


def dashboard(args: Namespace, config: Config):
    start_dashboard(config)


def add_dashboard_command(subparsers: Any):
    sub_parser = subparsers.add_parser("dashboard", help="Start the Financial Simulator dashboard")
    sub_parser.set_defaults(func=dashboard)
