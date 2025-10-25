import {index, route, type RouteConfig} from "@react-router/dev/routes";
import {BANK_ACCOUNTS_HREF, ENTITIES_HREF, LEDGER_ACCOUNTS_HREF, SCENARIOS_HREF} from "./strings";

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
] satisfies RouteConfig;
