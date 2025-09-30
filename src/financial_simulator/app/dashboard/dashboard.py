import logging
import re
from typing import Sequence

import dash
import dash_mantine_components as dmc  # type: ignore
from dash import ALL, Dash, Input, Output, State, callback, dcc

from financial_simulator.app.config import Config
from financial_simulator.app.dashboard.globals import init_api, init_engine

logger = logging.getLogger(__name__)

theme = {
    "primaryColor": "blue",
    "defaultRadius": "sm",
    "components": {
        "Card": {"defaultProps": {"shadow": "md"}},
    },
}

app = Dash(
    __name__,
    use_pages=True,
)

NAV_LINK = lambda relative_path: {"type": "nav_link", "relative_path": relative_path}

COLLECTION_PATHNAME_REGEX = re.compile(r"^/[^/]+$")
COLLECTION_ITEM_PATHNAME_REGEX = re.compile(r"^/([^/]+)/[^/]+$")


def get_nav_links() -> Sequence[dmc.NavLink]:
    return [
        dmc.NavLink(
            id=NAV_LINK(page["relative_path"]),
            label=page["name"],
            href=page["relative_path"],
            active="partial",
        )
        for page in dash.page_registry.values()
        if not page.get("exclude_from_navbar")
    ]


layout = [
    dcc.Location(
        id="location",
    ),
    dmc.AppShell(
        [
            dmc.AppShellHeader(
                dmc.Group(
                    [
                        dmc.Burger(
                            id="burger", size="sm", hiddenFrom="sm", opened=False
                        ),
                        dmc.Stack(
                            [
                                dmc.Title(
                                    id="header-title",
                                    children="Financial Simulator",
                                    size="lg",
                                ),
                                dmc.Breadcrumbs(
                                    id="header-breadcrumbs",
                                    separator="→",
                                    children=[
                                        dmc.Anchor("Home", href="/", underline="never"),
                                    ],
                                ),
                            ],
                            gap=2,
                        ),
                    ],
                    h="100%",
                    px="md",
                ),
            ),
            dmc.AppShellNavbar(
                id="navbar",
                children=get_nav_links(),
                p="md",
            ),
            dmc.AppShellMain(dash.page_container),
        ],
        header={"height": 60},
        padding="md",
        navbar={
            "width": 200,
            "breakpoint": "sm",
            "collapsed": {"mobile": True},
        },
        id="appshell",
    ),
]


app.layout = dmc.MantineProvider(
    theme=theme,
    children=layout,
)


@callback(
    Output("header-title", "children"),
    Output("header-breadcrumbs", "children"),
    Input("location", "pathname"),
    State("header-title", "children"),
    State("header-breadcrumbs", "children"),
)
def set_header(pathname, header_title, header_breadcrumbs):
    for page in dash.page_registry.values():
        link_data = page["match_path"](pathname)
        if link_data:
            header_data = page["header_data"](link_data)
            header_title = header_data["title"]
            header_breadcrumbs = [
                dmc.Anchor(
                    breadcrumb["label"], href=breadcrumb["href"], underline="never"
                )
                for breadcrumb in header_data["breadcrumbs"]
            ]
            break
    return header_title, header_breadcrumbs


@callback(
    Output("burger", "opened"),
    Input(NAV_LINK(ALL), "n_clicks"),
    config_prevent_initial_callbacks=True,
)
def navbar_click_link(_n_clicks):
    return False


@callback(
    Output("appshell", "navbar"),
    Input("burger", "opened"),
    State("appshell", "navbar"),
)
def burger_toggled(opened, navbar):
    navbar["collapsed"] = {"mobile": not opened}
    return navbar


def start_dashboard(config: Config):
    init_engine(config)
    init_api(config)
    app.run(debug=True)  # type: ignore
