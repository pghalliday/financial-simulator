import {createPostFormContext} from "~/providers/post_form_providers";
import type {LedgerAccountPost} from "~/client";

export const LEDGER_ACCOUNT_POST_FORM_NAME = "LedgerAccountPost"
export const [LedgerAccountPostFormProvider, useLedgerAccountPostFormContext] = createPostFormContext<LedgerAccountPost>()
