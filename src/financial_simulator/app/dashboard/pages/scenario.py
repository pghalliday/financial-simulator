import re
from uuid import UUID

import dash
import dash_mantine_components as dmc
from sqlalchemy.orm import Session

from financial_simulator.app.dashboard.globals import get_engine
from financial_simulator.app.database.schema import Scenario

SCENARIO_PATH_REGEX = r"/scenarios/([^/]+)"


def get_name(scenario_id: str) -> str:
    with Session(get_engine()) as session:
        scenario = session.get(Scenario, UUID(scenario_id))
        if not scenario:
            return scenario_id
        return str(scenario.name)


def format_title(scenario_name: str) -> str:
    return f"Scenario - {scenario_name}"


def get_title(scenario_id: str) -> str:
    return format_title(get_name(scenario_id))


def match_path(path: str) -> str | None:
    match = re.match(SCENARIO_PATH_REGEX, path)
    if match:
        return match.group(1)
    return None


def header_data(scenario_id: str):
    scenario_name = get_name(scenario_id)
    return {
        "title": format_title(scenario_name),
        "breadcrumbs": [
            {"label": "Home", "href": "/"},
            {"label": "Scenarios", "href": "/scenarios"},
            {"label": scenario_name, "href": f"/scenarios/{scenario_id}"},
        ],
    }


dash.register_page(
    __name__,
    exclude_from_navbar=True,
    path_template="/scenarios/<scenario_id>",
    name="Scenario",
    title=get_title,
    match_path=match_path,
    header_data=header_data,
)


def layout(scenario_id=None, **kwargs):
    return dmc.Container(
        dmc.Text(f"Scenario ID: {scenario_id}"),
    )
