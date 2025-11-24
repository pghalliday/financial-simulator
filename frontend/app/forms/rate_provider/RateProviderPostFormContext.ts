import {createPostFormContext} from "~/providers/post_form_providers";
import type {RateProviderPost} from "~/lib/types";

export const RATE_PROVIDER_POST_FORM_NAME = "RateProviderPost"
export const [RateProviderPostFormProvider, useRateProviderPostFormContext] = createPostFormContext<RateProviderPost>()
