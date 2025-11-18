import {ENTITY_POST_FORM_NAME, useEntityPostFormContext} from "~/forms/entity/EntityPostFormContext";
import {SCENARIO_POST_FORM_NAME, useScenarioPostFormContext} from "~/forms/scenario/ScenarioPostFormContext";
import {
    LEDGER_ACCOUNT_POST_FORM_NAME,
    useLedgerAccountPostFormContext
} from "~/forms/ledger_account/LedgerAccountPostFormContext";
import {BANK_ACCOUNT_POST_FORM_NAME, useBankAccountFormContext} from "~/forms/bank_account/BankAccountPostFormContext";
import {RATE_POST_FORM_NAME, useRatePostFormContext} from "~/forms/rate/RatePostFormContext";

export const FORM_REGISTRY = {
    [ENTITY_POST_FORM_NAME]: useEntityPostFormContext,
    [SCENARIO_POST_FORM_NAME]: useScenarioPostFormContext,
    [LEDGER_ACCOUNT_POST_FORM_NAME]: useLedgerAccountPostFormContext,
    [BANK_ACCOUNT_POST_FORM_NAME]: useBankAccountFormContext,
    [RATE_POST_FORM_NAME]: useRatePostFormContext,
}
