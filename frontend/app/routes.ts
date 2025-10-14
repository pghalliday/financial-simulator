import {index, route, type RouteConfig} from "@react-router/dev/routes";
import {ENTITIES_HREF, ENTITY_HREF, SCENARIO_HREF, SCENARIOS_HREF} from "./strings";

export default [
    index("routes/compare_scenarios.tsx"),
    route(SCENARIOS_HREF, "./routes/scenarios.tsx"),
    route(SCENARIO_HREF(':scenarioId'), "./routes/scenario.tsx"),
    route(ENTITIES_HREF, "./routes/entities.tsx"),
    route(ENTITY_HREF(':entityId'), "./routes/entity.tsx"),
] satisfies RouteConfig;
