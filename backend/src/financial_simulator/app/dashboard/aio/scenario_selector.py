import logging
import uuid
from typing import Mapping, Sequence

import dash_mantine_components as dmc
from dash import MATCH, Input, Output, State, callback
from sqlalchemy.orm import Session

from financial_simulator.app.dashboard.aio.aio_id import aio_id_creator
from financial_simulator.app.dashboard.globals import get_db_engine
from financial_simulator.app.database.schema import Scenario

logger = logging.getLogger(__name__)


def scenario_selector_aio_id_creator(sub_component: str):
    return aio_id_creator("ScenarioSelectorAIO", sub_component)


class ScenarioSelector(dmc.Box):
    class ids:
        multi_select = scenario_selector_aio_id_creator("multi_select")

    ids = ids

    def __init__(self, aio_id: str | None = None):
        if aio_id is None:
            aio_id = str(uuid.uuid4())

        with Session(get_db_engine()) as session:
            scenarios = session.query(Scenario).all()
            multi_select_data = [
                {"value": str(scenario.id), "label": scenario.name}
                for scenario in scenarios
            ]

        super().__init__(
            [
                dmc.MultiSelect(
                    id=self.ids.multi_select(aio_id),
                    label="Scenarios",
                    placeholder="Select Scenarios",
                    data=multi_select_data,
                    persistence=True,
                )
            ]
        )

    @staticmethod
    @callback(
        Output(ids.multi_select(MATCH), "value"),
        Input(ids.multi_select(MATCH), "value"),
        State(ids.multi_select(MATCH), "data"),
    )
    def check_selected(
        value: Sequence[str], data: Sequence[Mapping[str, str]]
    ) -> Sequence[str]:
        valid_scenario_ids = [datum["value"] for datum in data]
        return [
            scenario_id for scenario_id in value if scenario_id in valid_scenario_ids
        ]
