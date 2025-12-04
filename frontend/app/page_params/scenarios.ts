import type {ScenarioGet} from "../../client";
import {PageParams} from "./PageParams";


export const SCENARIO_PARAMS = new PageParams<ScenarioGet>(
    "Scenarios",
    "/scenario",
    "scenario",
    "Scenario",
    "name",
    (item: ScenarioGet) => ({
        id: item.id,
        name: item.name,
    }),
)