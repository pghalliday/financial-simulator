import {index, route, type RouteConfig} from "@react-router/dev/routes";
import {
    BANK_ACCOUNT_HREF,
    BANK_ACCOUNTS_HREF,
    ENTITIES_HREF,
    ENTITY_HREF,
    SCENARIO_HREF,
    SCENARIOS_HREF
} from "./strings";

export default [
    index("routes/compare_scenarios.tsx"),
    route(SCENARIOS_HREF, "./routes/scenarios.tsx"),
    route(SCENARIO_HREF(':scenarioId'), "./routes/scenario.tsx"),
    route(ENTITIES_HREF, "./routes/entities.tsx"),
    route(ENTITY_HREF(':entityId'), "./routes/entity.tsx"),
    route(BANK_ACCOUNTS_HREF, "./routes/bank_accounts.tsx"),
    route(BANK_ACCOUNT_HREF(':bankAccountId'), "./routes/bank_account.tsx"),
] satisfies RouteConfig;
