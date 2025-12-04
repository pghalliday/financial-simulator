import {createPostFormContext} from "~/providers/post_form_providers";
import type {MergeRateProviderPost, NextRateProviderPost, ScheduledRateProviderPost} from "../../../client";

export const [ScheduledRateProviderPostFormProvider, useScheduledRateProviderPostFormContext] = createPostFormContext<ScheduledRateProviderPost>()
export const [MergeRateProviderPostFormProvider, useMergeRateProviderPostFormContext] = createPostFormContext<MergeRateProviderPost>()
export const [NextRateProviderPostFormProvider, useNextRateProviderPostFormContext] = createPostFormContext<NextRateProviderPost>()
