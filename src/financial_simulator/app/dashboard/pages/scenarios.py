import logging
from typing import Any, Dict
from uuid import UUID

import dash
from dash import Input, callback, set_props
from sqlalchemy.orm import Session

import financial_simulator.app.dashboard.aio as aio
from financial_simulator.app.dashboard.aio.list.list import ListItemData
from financial_simulator.app.dashboard.constants import (
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_NAME,
    LOCATION_ID,
    SCENARIO_LABEL,
    SCENARIOS_HREF,
    SCENARIOS_LIST_ID,
    SCENARIOS_NAME,
    get_scenario_href,
)
from financial_simulator.app.dashboard.globals import get_db_engine
from financial_simulator.app.database.schema import Scenario

logger = logging.getLogger(__name__)

dash.register_page(
    __name__,
    order=1,
    path=SCENARIOS_HREF,
    name=SCENARIOS_NAME,
    title=SCENARIOS_NAME,
    match_path=lambda path: path == SCENARIOS_HREF,
    header_data=lambda _: {
        "title": SCENARIOS_NAME,
        "breadcrumbs": [
            {"label": COMPARE_SCENARIOS_NAME, "href": COMPARE_SCENARIOS_HREF},
            {"label": SCENARIOS_NAME, "href": SCENARIOS_HREF},
        ],
    },
)


def to_list_item_data(scenario: Scenario) -> ListItemData:
    return ListItemData(
        id=str(scenario.id),
        name=str(scenario.name),
        description=str(scenario.description),
        href=get_scenario_href(str(scenario.id)),
    )


@callback(
    Input(aio.List.ids.add_action_store(SCENARIOS_LIST_ID), "data"),
    config_prevent_initial_callbacks=True,
)
def add_scenario(add_action_raw: Dict[str, Any]) -> None:
    add_action = aio.ListAddAction.model_validate(add_action_raw)
    if add_action.type == aio.ListAddActionType.ADD:
        with Session(get_db_engine()) as session:
            scenario = Scenario(
                name=add_action.add_data.name,
                description=add_action.add_data.description,
            )
            session.add(scenario)
            session.commit()
            set_props(
                dash.ctx.triggered_id,
                {
                    "data": aio.ListAddAction(
                        type=aio.ListAddActionType.COMPLETE,
                        complete_data=to_list_item_data(scenario),
                    ).model_dump()
                },
            )


@callback(
    Input(aio.List.ids.delete_action_store(SCENARIOS_LIST_ID), "data"),
    config_prevent_initial_callbacks=True,
)
def delete_scenario(delete_action_raw: Dict[str, Any]) -> None:
    delete_action = aio.ListDeleteAction.model_validate(delete_action_raw)
    if delete_action.type == aio.ListDeleteActionType.DELETE:
        with Session(get_db_engine()) as session:
            scenario = session.get(Scenario, UUID(delete_action.id))
            if scenario is not None:
                session.delete(scenario)
                session.commit()
            set_props(
                dash.ctx.triggered_id,
                {
                    "data": aio.ListDeleteAction(
                        type=aio.ListDeleteActionType.COMPLETE,
                        id=delete_action.id,
                    ).model_dump()
                },
            )


def layout():
    with Session(get_db_engine()) as session:
        scenarios = session.query(Scenario).all()
        items = [to_list_item_data(scenario) for scenario in scenarios]
    return aio.List(
        aio_id=SCENARIOS_LIST_ID,
        label=SCENARIO_LABEL,
        items=items,
        location_id=LOCATION_ID,
    )
