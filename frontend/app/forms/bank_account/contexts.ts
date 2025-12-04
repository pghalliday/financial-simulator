import {createPostFormContext} from "~/providers/post_form_providers";
import type {BankAccountPost} from "../../../client";

export const [BankAccountPostFormProvider, useBankAccountPostFormContext] = createPostFormContext<BankAccountPost>()
