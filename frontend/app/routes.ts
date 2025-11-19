import {index, route, type RouteConfig} from "@react-router/dev/routes";
import {
    BANK_ACCOUNTS_HREF,
    ENTITIES_HREF,
    LEDGER_ACCOUNTS_HREF,
    PROVIDERS_HREF,
    RATES_HREF,
    SCENARIOS_HREF,
    SCHEDULES_HREF,
    VALUES_HREF
} from "./strings";

export default [
    index("routes/CompareScenarios.tsx"),
    route(SCENARIOS_HREF, "./routes/Scenarios.tsx"),
    route(SCENARIOS_HREF + '/:itemId', "./routes/Scenario.tsx"),
    route(ENTITIES_HREF, "./routes/Entities.tsx"),
    route(ENTITIES_HREF + '/:itemId', "./routes/Entity.tsx"),
    route(BANK_ACCOUNTS_HREF, "./routes/BankAccounts.tsx"),
    route(BANK_ACCOUNTS_HREF + '/:itemId', "./routes/BankAccount.tsx"),
    route(LEDGER_ACCOUNTS_HREF, "./routes/LedgerAccounts.tsx"),
    route(LEDGER_ACCOUNTS_HREF + '/:itemId', "./routes/LedgerAccount.tsx"),
    route(RATES_HREF, "./routes/Rates.tsx"),
    route(RATES_HREF + '/:itemId', "./routes/Rate.tsx"),
    route(VALUES_HREF, "./routes/Values.tsx"),
    route(VALUES_HREF + '/:itemId', "./routes/Value.tsx"),
    route(SCHEDULES_HREF, "./routes/Schedules.tsx"),
    route(SCHEDULES_HREF + '/:itemId', "./routes/Schedule.tsx"),
    route(PROVIDERS_HREF, "./routes/Providers.tsx"),
    route(PROVIDERS_HREF + '/:itemId', "./routes/Provider.tsx"),
    route("/playground", "./routes/Playground.tsx"),
] satisfies RouteConfig;
