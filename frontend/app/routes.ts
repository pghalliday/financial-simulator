import {index, route, type RouteConfig} from "@react-router/dev/routes";
import {SCENARIO_PARAMS} from "./page_params/scenarios";
import {CORPORATION_ENTITY_PARAMS, INDIVIDUAL_ENTITY_PARAMS} from "./page_params/entities";
import {BANK_ACCOUNT_PARAMS} from "./page_params/bank_accounts";
import {LEDGER_ACCOUNT_PARAMS} from "./page_params/ledger_accounts";
import {BANDED_RATE_PARAMS, CONTINUOUS_RATE_PARAMS, PERIODIC_RATE_PARAMS} from "./page_params/rates";
import {
    ALL_SCHEDULE_PARAMS,
    ANY_SCHEDULE_PARAMS,
    DAILY_SCHEDULE_PARAMS,
    DAY_SCHEDULE_PARAMS,
    FROM_SCHEDULE_PARAMS,
    MONTHLY_SCHEDULE_PARAMS,
    RANGE_SCHEDULE_PARAMS,
    UNTIL_SCHEDULE_PARAMS,
    WEEKLY_SCHEDULE_PARAMS,
    YEARLY_SCHEDULE_PARAMS
} from "./page_params/schedules";
import {
    MERGE_DECIMAL_PROVIDER_PARAMS,
    NEXT_DECIMAL_PROVIDER_PARAMS,
    SCHEDULED_DECIMAL_PROVIDER_PARAMS
} from "./page_params/decimal_providers";
import {
    MERGE_RATE_PROVIDER_PARAMS,
    NEXT_RATE_PROVIDER_PARAMS,
    SCHEDULED_RATE_PROVIDER_PARAMS
} from "./page_params/rate_providers";

export default [
    index("routes/compare_scenarios/CompareScenarios.tsx"),
    route(SCENARIO_PARAMS.collectionHref, "./routes/scenarios/Scenarios.tsx"),
    route(SCENARIO_PARAMS.collectionHref + '/:itemId', "./routes/scenarios/Scenario.tsx"),
    route(INDIVIDUAL_ENTITY_PARAMS.collectionHref, "./routes/entities/IndividualEntities.tsx"),
    route(INDIVIDUAL_ENTITY_PARAMS.collectionHref + '/:itemId', "./routes/entities/IndividualEntity.tsx"),
    route(CORPORATION_ENTITY_PARAMS.collectionHref, "./routes/entities/CorporationEntities.tsx"),
    route(CORPORATION_ENTITY_PARAMS.collectionHref + '/:itemId', "./routes/entities/CorporationEntity.tsx"),
    route(BANK_ACCOUNT_PARAMS.collectionHref, "./routes/bank_accounts/BankAccounts.tsx"),
    route(BANK_ACCOUNT_PARAMS.collectionHref + '/:itemId', "./routes/bank_accounts/BankAccount.tsx"),
    route(LEDGER_ACCOUNT_PARAMS.collectionHref, "./routes/ledger_accounts/LedgerAccounts.tsx"),
    route(LEDGER_ACCOUNT_PARAMS.collectionHref + '/:itemId', "./routes/ledger_accounts/LedgerAccount.tsx"),
    route(CONTINUOUS_RATE_PARAMS.collectionHref, "./routes/rates/ContinuousRates.tsx"),
    route(CONTINUOUS_RATE_PARAMS.collectionHref + '/:itemId', "./routes/rates/ContinuousRate.tsx"),
    route(PERIODIC_RATE_PARAMS.collectionHref, "./routes/rates/PeriodicRates.tsx"),
    route(PERIODIC_RATE_PARAMS.collectionHref + '/:itemId', "./routes/rates/PeriodicRate.tsx"),
    route(BANDED_RATE_PARAMS.collectionHref, "./routes/rates/BandedRates.tsx"),
    route(BANDED_RATE_PARAMS.collectionHref + '/:itemId', "./routes/rates/BandedRate.tsx"),
    route(DAILY_SCHEDULE_PARAMS.collectionHref, "./routes/schedules/DailySchedules.tsx"),
    route(DAILY_SCHEDULE_PARAMS.collectionHref + '/:itemId', "./routes/schedules/DailySchedule.tsx"),
    route(DAY_SCHEDULE_PARAMS.collectionHref, "./routes/schedules/DaySchedules.tsx"),
    route(DAY_SCHEDULE_PARAMS.collectionHref + '/:itemId', "./routes/schedules/DaySchedule.tsx"),
    route(WEEKLY_SCHEDULE_PARAMS.collectionHref, "./routes/schedules/WeeklySchedules.tsx"),
    route(WEEKLY_SCHEDULE_PARAMS.collectionHref + '/:itemId', "./routes/schedules/WeeklySchedule.tsx"),
    route(MONTHLY_SCHEDULE_PARAMS.collectionHref, "./routes/schedules/MonthlySchedules.tsx"),
    route(MONTHLY_SCHEDULE_PARAMS.collectionHref + '/:itemId', "./routes/schedules/MonthlySchedule.tsx"),
    route(YEARLY_SCHEDULE_PARAMS.collectionHref, "./routes/schedules/YearlySchedules.tsx"),
    route(YEARLY_SCHEDULE_PARAMS.collectionHref + '/:itemId', "./routes/schedules/YearlySchedule.tsx"),
    route(FROM_SCHEDULE_PARAMS.collectionHref, "./routes/schedules/FromSchedules.tsx"),
    route(FROM_SCHEDULE_PARAMS.collectionHref + '/:itemId', "./routes/schedules/FromSchedule.tsx"),
    route(UNTIL_SCHEDULE_PARAMS.collectionHref, "./routes/schedules/UntilSchedules.tsx"),
    route(UNTIL_SCHEDULE_PARAMS.collectionHref + '/:itemId', "./routes/schedules/UntilSchedule.tsx"),
    route(RANGE_SCHEDULE_PARAMS.collectionHref, "./routes/schedules/RangeSchedules.tsx"),
    route(RANGE_SCHEDULE_PARAMS.collectionHref + '/:itemId', "./routes/schedules/RangeSchedule.tsx"),
    route(ALL_SCHEDULE_PARAMS.collectionHref, "./routes/schedules/AllSchedules.tsx"),
    route(ALL_SCHEDULE_PARAMS.collectionHref + '/:itemId', "./routes/schedules/AllSchedule.tsx"),
    route(ANY_SCHEDULE_PARAMS.collectionHref, "./routes/schedules/AnySchedules.tsx"),
    route(ANY_SCHEDULE_PARAMS.collectionHref + '/:itemId', "./routes/schedules/AnySchedule.tsx"),
    route(SCHEDULED_DECIMAL_PROVIDER_PARAMS.collectionHref, "./routes/decimal_providers/ScheduledDecimalProviders.tsx"),
    route(SCHEDULED_DECIMAL_PROVIDER_PARAMS.collectionHref + '/:itemId', "./routes/decimal_providers/ScheduledDecimalProvider.tsx"),
    route(MERGE_DECIMAL_PROVIDER_PARAMS.collectionHref, "./routes/decimal_providers/MergeDecimalProviders.tsx"),
    route(MERGE_DECIMAL_PROVIDER_PARAMS.collectionHref + '/:itemId', "./routes/decimal_providers/MergeDecimalProvider.tsx"),
    route(NEXT_DECIMAL_PROVIDER_PARAMS.collectionHref, "./routes/decimal_providers/NextDecimalProviders.tsx"),
    route(NEXT_DECIMAL_PROVIDER_PARAMS.collectionHref + '/:itemId', "./routes/decimal_providers/NextDecimalProvider.tsx"),
    route(SCHEDULED_RATE_PROVIDER_PARAMS.collectionHref, "./routes/rate_providers/ScheduledRateProviders.tsx"),
    route(SCHEDULED_RATE_PROVIDER_PARAMS.collectionHref + '/:itemId', "./routes/rate_providers/ScheduledRateProvider.tsx"),
    route(MERGE_RATE_PROVIDER_PARAMS.collectionHref, "./routes/rate_providers/MergeRateProviders.tsx"),
    route(MERGE_RATE_PROVIDER_PARAMS.collectionHref + '/:itemId', "./routes/rate_providers/MergeRateProvider.tsx"),
    route(NEXT_RATE_PROVIDER_PARAMS.collectionHref, "./routes/rate_providers/NextRateProviders.tsx"),
    route(NEXT_RATE_PROVIDER_PARAMS.collectionHref + '/:itemId', "./routes/rate_providers/NextRateProvider.tsx"),
    route("/playground", "./routes/Playground.tsx"),
] satisfies RouteConfig;
