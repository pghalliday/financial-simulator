import logging

import dash
from dash import Input, Output, callback, dcc, html
from dash_mantine_components import Box  # type: ignore

from financial_simulator.app.dashboard.components.scenario_selector import (
    create_scenario_selector,
)
from financial_simulator.app.dashboard.globals import get_api
from financial_simulator.lib.util.data import plot_account_balances

SCENARIO_SELECTOR = "scenario-selector"

logger = logging.getLogger(__name__)

dash.register_page(__name__, path="/")

layout = html.Div(
    [
        create_scenario_selector(SCENARIO_SELECTOR),
        Box(
            children=[
                dcc.Graph(
                    id="current-account-balances",
                ),
                dcc.Graph(
                    id="savings-account-balances",
                ),
            ]
        ),
    ]
)


@callback(
    Output("current-account-balances", "figure"),
    Output("savings-account-balances", "figure"),
    Input("current-account-balances", "figure"),
    Input("savings-account-balances", "figure"),
)
def initialize_charts(_0, _1):
    logger.info("Initializing charts")

    days = get_api().get_days()

    current_account_balances_figure = plot_account_balances(
        days=days,
        account_path=("assets", "bank_accounts", "current"),
        columns=("Jack", "Jill", "Widgets LTD"),
        title="Savings Account Balances",
        is_debit_account=True,
    )

    savings_account_balances_figure = plot_account_balances(
        days=days,
        account_path=("assets", "bank_accounts", "savings"),
        columns=("Jack", "Jill", "Widgets LTD"),
        title="Savings Account Balances",
        is_debit_account=True,
    )

    return current_account_balances_figure, savings_account_balances_figure
