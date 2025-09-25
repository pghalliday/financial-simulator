import logging

import dash
import dash_mantine_components as dmc  # type: ignore
from dash import Dash, Input, Output, State, callback

from financial_simulator.app.api import API
from financial_simulator.app.config import Config
from financial_simulator.app.dashboard.globals import set_api

logger = logging.getLogger(__name__)

theme = {
    "primaryColor": "teal",
    "defaultRadius": "sm",
    "components": {
        "Card": {"defaultProps": {"shadow": "md"}},
    },
}

app = Dash(__name__, use_pages=True)

layout = dmc.AppShell(
    [
        dmc.AppShellHeader(
            dmc.Group(
                [
                    dmc.Burger(id="burger", size="sm", hiddenFrom="sm", opened=False),
                    dmc.Title("Financial Simulator"),
                ],
                h="100%",
                px="md",
            )
        ),
        dmc.AppShellNavbar(
            id="navbar",
            children=[
                dmc.NavLink(
                    label=page["name"],
                    href=page["relative_path"],
                    active="exact",
                )
                for page in dash.page_registry.values()
            ],
            p="md",
        ),
        dmc.AppShellMain(dash.page_container),
    ],
    header={"height": 60},
    padding="md",
    navbar={
        "width": 300,
        "breakpoint": "sm",
        "collapsed": {"mobile": True},
    },
    id="appshell",
)


app.layout = dmc.MantineProvider(
    theme=theme,
    children=layout,
)


@callback(
    Output("appshell", "navbar"),
    Input("burger", "opened"),
    State("appshell", "navbar"),
)
def navbar_is_open(opened, navbar):
    navbar["collapsed"] = {"mobile": not opened}
    return navbar


def start_dashboard(config: Config):
    set_api(API(config))
    app.run(debug=True)  # type: ignore
