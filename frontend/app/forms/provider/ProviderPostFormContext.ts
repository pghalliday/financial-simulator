import {createPostFormContext} from "~/providers/post_form_providers";
import type {ProviderPost} from "~/lib/types";

export const PROVIDER_POST_FORM_NAME = "ProviderPost"
export const [ProviderPostFormProvider, useProviderPostFormContext] = createPostFormContext<ProviderPost>()
