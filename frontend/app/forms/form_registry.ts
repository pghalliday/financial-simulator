import {ENTITY_POST_FORM_NAME, useEntityPostFormContext} from "~/forms/entity/EntityPostFormContext";
import {SCENARIO_POST_FORM_NAME, useScenarioPostFormContext} from "~/forms/scenario/ScenarioPostFormContext";
import {
    LEDGER_ACCOUNT_POST_FORM_NAME,
    useLedgerAccountPostFormContext
} from "~/forms/ledger_account/LedgerAccountPostFormContext";
import {
    BANK_ACCOUNT_POST_FORM_NAME,
    useBankAccountPostFormContext
} from "~/forms/bank_account/BankAccountPostFormContext";
import {RATE_POST_FORM_NAME, useRatePostFormContext} from "~/forms/rate/RatePostFormContext";
import {SCHEDULE_POST_FORM_NAME, useSchedulePostFormContext} from "~/forms/schedule/SchedulePostFormContext";
import {
    DECIMAL_PROVIDER_POST_FORM_NAME,
    useDecimalProviderPostFormContext
} from "~/forms/decimal_provider/DecimalProviderPostFormContext";
import {
    RATE_PROVIDER_POST_FORM_NAME,
    useRateProviderPostFormContext
} from "~/forms/rate_provider/RateProviderPostFormContext";

export const FORM_REGISTRY = {
    [ENTITY_POST_FORM_NAME]: useEntityPostFormContext,
    [SCENARIO_POST_FORM_NAME]: useScenarioPostFormContext,
    [LEDGER_ACCOUNT_POST_FORM_NAME]: useLedgerAccountPostFormContext,
    [BANK_ACCOUNT_POST_FORM_NAME]: useBankAccountPostFormContext,
    [RATE_POST_FORM_NAME]: useRatePostFormContext,
    [SCHEDULE_POST_FORM_NAME]: useSchedulePostFormContext,
    [DECIMAL_PROVIDER_POST_FORM_NAME]: useDecimalProviderPostFormContext,
    [RATE_PROVIDER_POST_FORM_NAME]: useRateProviderPostFormContext,
}
