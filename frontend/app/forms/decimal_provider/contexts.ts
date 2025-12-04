import {createPostFormContext} from "~/providers/post_form_providers";
import type {MergeDecimalProviderPost, NextDecimalProviderPost, ScheduledDecimalProviderPost} from "../../../client";

export const [MergeDecimalProviderPostFormProvider, useMergeDecimalProviderPostFormContext] = createPostFormContext<MergeDecimalProviderPost>()
export const [NextDecimalProviderPostFormProvider, useNextDecimalProviderPostFormContext] = createPostFormContext<NextDecimalProviderPost>()
export const [ScheduledDecimalProviderPostFormProvider, useScheduledDecimalProviderPostFormContext] = createPostFormContext<ScheduledDecimalProviderPost>()
