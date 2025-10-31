import {createPostFormContext} from "~/providers/post_form_providers";
import type {BankAccountPost} from "~/client";

export const BANK_ACCOUNT_POST_FORM_NAME = "BankAccountPost"
export const [BankAccountPostFormProvider, useBankAccountFormContext] = createPostFormContext<BankAccountPost>()
