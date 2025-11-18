import {createPostFormContext} from "~/providers/post_form_providers";
import type {RatePost} from "~/lib/types";

export const RATE_POST_FORM_NAME = "RatePost"
export const [RatePostFormProvider, useRatePostFormContext] = createPostFormContext<RatePost>()
