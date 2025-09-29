import logging
from collections import defaultdict
from typing import List, Sequence

import dash
import dash_mantine_components as dmc  # type: ignore
from dash import Dash, Input, Output, State, callback

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


def get_nav_links() -> Sequence[dmc.NavLink]:
    sections: defaultdict[str | None, List] = defaultdict(list)
    for key, page in dash.page_registry.items():
        parts = key.split(".")
        if len(parts) == 2:
            sections[None].append(page)
        elif len(parts) == 3:
            sections[parts[1]].append(page)
    root_nav_links = [
        dmc.NavLink(
            label=page["name"],
            href=page["relative_path"],
            active="partial",
        )
        for page in sections[None]
        if not page.get("exclude_from_navbar")
    ]
    section_nav_links = [
        dmc.NavLink(
            label=section.title(),
            childrenOffset=28,
            children=[
                dmc.NavLink(
                    label=page["name"],
                    href=page["relative_path"],
                    active="partial",
                )
                for page in pages
                if not page.get("exclude_from_navbar")
            ],
        )
        for section, pages in sections.items()
        if section is not None
    ]
    return root_nav_links + section_nav_links


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
    init_engine(config)
    init_api(config)
    app.run(debug=True)  # type: ignore
