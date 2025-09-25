import logging

import dash_mantine_components as dmc
from dash import html, dcc, Dash, Output, Input

from financial_simulator.app.api import API
from financial_simulator.app.config import Config
from financial_simulator.lib.util.data import plot_account_balances

logger = logging.getLogger(__name__)

api: API | None = None

theme={
    "primaryColor": "teal",
    "defaultRadius": "sm",
    "components": {
        "Card": {
            "defaultProps": {
                "shadow": "md"
            }
        }
    }
}


app = Dash(__name__)
app.layout = dmc.MantineProvider(
    theme=theme,
    children=html.Div(
        children=[
            dcc.Store(id="days"),
            html.H1(children="Financial Simulator"),
            html.P(
                children=("Do stuff"),
            ),
            dcc.Graph(
                id="current-account-balances",
            ),
            dcc.Graph(
                id="savings-account-balances",
            ),
        ]
    )
)

@app.callback(
    Output("current-account-balances", "figure"),
    Output("savings-account-balances", "figure"),
    Input("current-account-balances", "figure"),
    Input("savings-account-balances", "figure"),
)
def initialize_charts(_0, _1):
    logger.info("Initializing charts")

    days = api.get_days()

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

def start_dashboard(config: Config):
    global api
    api = API(config)
    app.run(debug=True) # type: ignore
