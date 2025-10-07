import logging

import dash
import dash_mantine_components as dmc
from dash import Input, Output, callback, dcc

import financial_simulator.app.dashboard.aio as aio
from financial_simulator.app.dashboard.constants import (
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_NAME,
    COMPARE_SCENARIOS_SCENARIO_SELECTOR_ID,
)
from financial_simulator.app.dummy_days import init_dummy_days
from financial_simulator.lib.util.data import plot_account_balances

logger = logging.getLogger(__name__)

dash.register_page(
    __name__,
    order=0,
    path=COMPARE_SCENARIOS_HREF,
    name=COMPARE_SCENARIOS_NAME,
    title=COMPARE_SCENARIOS_NAME,
    match_path=lambda path: path == COMPARE_SCENARIOS_HREF,
    header_data=lambda _: {
        "title": COMPARE_SCENARIOS_NAME,
        "breadcrumbs": [
            {"label": COMPARE_SCENARIOS_NAME, "href": COMPARE_SCENARIOS_HREF},
        ],
    },
)


@callback(
    Output("current-account-balances", "figure"),
    Output("savings-account-balances", "figure"),
    Input("current-account-balances", "figure"),
    Input("savings-account-balances", "figure"),
)
def initialize_charts(_0, _1):
    days = init_dummy_days()
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


def layout():
    return dmc.Box(
        [
            aio.ScenarioSelector(aio_id=COMPARE_SCENARIOS_SCENARIO_SELECTOR_ID),
            dmc.Box(
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
