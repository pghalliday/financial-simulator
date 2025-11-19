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
import {useValuePostFormContext, VALUE_POST_FORM_NAME} from "~/forms/value/ValuePostFormContext";
import {SCHEDULE_POST_FORM_NAME, useSchedulePostFormContext} from "~/forms/schedule/SchedulePostFormContext";
import {PROVIDER_POST_FORM_NAME, useProviderPostFormContext} from "~/forms/provider/ProviderPostFormContext";

export const FORM_REGISTRY = {
    [ENTITY_POST_FORM_NAME]: useEntityPostFormContext,
    [SCENARIO_POST_FORM_NAME]: useScenarioPostFormContext,
    [LEDGER_ACCOUNT_POST_FORM_NAME]: useLedgerAccountPostFormContext,
    [BANK_ACCOUNT_POST_FORM_NAME]: useBankAccountPostFormContext,
    [RATE_POST_FORM_NAME]: useRatePostFormContext,
    [VALUE_POST_FORM_NAME]: useValuePostFormContext,
    [SCHEDULE_POST_FORM_NAME]: useSchedulePostFormContext,
    [PROVIDER_POST_FORM_NAME]: useProviderPostFormContext,
}
