import {createPostFormContext} from "~/providers/post_form_providers";
import type {BandedRatePost, ContinuousRatePost, PeriodicRatePost} from "../../../client";

export const [PeriodicRatePostFormProvider, usePeriodicRatePostFormContext] = createPostFormContext<PeriodicRatePost>()
export const [ContinuousRatePostFormProvider, useContinuousRatePostFormContext] = createPostFormContext<ContinuousRatePost>()
export const [BandedRatePostFormProvider, useBandedRatePostFormContext] = createPostFormContext<BandedRatePost>()
