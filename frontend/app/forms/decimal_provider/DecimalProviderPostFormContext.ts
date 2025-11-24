import {createPostFormContext} from "~/providers/post_form_providers";
import type {DecimalProviderPost} from "~/lib/types";

export const DECIMAL_PROVIDER_POST_FORM_NAME = "DecimalProviderPost"
export const [DecimalProviderPostFormProvider, useDecimalProviderPostFormContext] = createPostFormContext<DecimalProviderPost>()
