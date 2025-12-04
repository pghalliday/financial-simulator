import {createPostFormContext} from "~/providers/post_form_providers";
import type {LedgerAccountPost} from "../../../client";

export const [LedgerAccountPostFormProvider, useLedgerAccountPostFormContext] = createPostFormContext<LedgerAccountPost>()
