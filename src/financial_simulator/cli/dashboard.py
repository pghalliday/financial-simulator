from argparse import Namespace

from financial_simulator.config import Config
from financial_simulator.dashboard.dashboard import Dashboard


def dashboard(args: Namespace, config: Config):
    Dashboard(config).start()


def add_dashboard_command(subparsers):
    sub_parser = subparsers.add_parser("dashboard", help="Start the Financial Simulator dashboard")
    sub_parser.set_defaults(func=dashboard)
