import logging
import re
from typing import Sequence

import dash
import dash_mantine_components as dmc  # type: ignore
from dash import ALL, Dash, Input, Output, State, callback, dcc

from financial_simulator.app.config import Config
from financial_simulator.app.dashboard.component_ids import (
    APPSHELL_ID,
    BURGER_ID,
    HEADER_BREADCRUMBS_ID,
    HEADER_TITLE_ID,
    LOCATION_ID,
    NAV_LINK_ID,
    NAVBAR_ID,
)
from financial_simulator.app.dashboard.globals import init_db_engine

logger = logging.getLogger(__name__)

theme = {
    "primaryColor": "blue",
    "defaultRadius": "sm",
    "components": {
        "Card": {"defaultProps": {"shadow": "md"}},
    },
}


def nav_link_id(relative_path):
    return {"type": NAV_LINK_ID, "relative_path": relative_path}


def get_nav_links() -> Sequence[dmc.NavLink]:
    return [
        dmc.NavLink(
            id=nav_link_id(page["relative_path"]),
            label=page["name"],
            href=page["relative_path"],
            active="partial",
        )
        for page in dash.page_registry.values()
        if not page.get("exclude_from_navbar")
    ]


COLLECTION_PATHNAME_REGEX = re.compile(r"^/[^/]+$")
COLLECTION_ITEM_PATHNAME_REGEX = re.compile(r"^/([^/]+)/[^/]+$")


def start_dashboard(config: Config):
    init_db_engine(config)

    app = Dash(
        __name__,
        use_pages=True,
        suppress_callback_exceptions=True,
    )

    @callback(
        Output(HEADER_TITLE_ID, "children"),
        Output(HEADER_BREADCRUMBS_ID, "children"),
        Input("location", "pathname"),
        State(HEADER_TITLE_ID, "children"),
        State(HEADER_BREADCRUMBS_ID, "children"),
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
        Output(BURGER_ID, "opened"),
        Input(nav_link_id(ALL), "n_clicks"),
        config_prevent_initial_callbacks=True,
    )
    def navbar_click_link(_n_clicks):
        return False

    @callback(
        Output(APPSHELL_ID, NAVBAR_ID),
        Input(BURGER_ID, "opened"),
        State(APPSHELL_ID, NAVBAR_ID),
    )
    def burger_toggled(opened, navbar):
        navbar["collapsed"] = {"mobile": not opened}
        return navbar

    app.layout = dmc.MantineProvider(
        theme=theme,
        children=[
            dcc.Location(
                id=LOCATION_ID,
            ),
            dmc.AppShell(
                [
                    dmc.AppShellHeader(
                        dmc.Group(
                            [
                                dmc.Burger(
                                    id=BURGER_ID,
                                    size="sm",
                                    hiddenFrom="sm",
                                    opened=False,
                                ),
                                dmc.Stack(
                                    [
                                        dmc.Title(
                                            id=HEADER_TITLE_ID,
                                            children="Financial Simulator",
                                            size="lg",
                                        ),
                                        dmc.Breadcrumbs(
                                            id=HEADER_BREADCRUMBS_ID,
                                            separator="→",
                                            children=[
                                                dmc.Anchor(
                                                    "Home", href="/", underline="never"
                                                ),
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
                        id=NAVBAR_ID,
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
                id=APPSHELL_ID,
            ),
        ],
    )

    app.run(debug=True)  # type: ignore
