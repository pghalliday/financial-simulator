import {createPostFormContext} from "~/providers/post_form_providers";
import type {SchedulePost} from "~/lib/types";

export const SCHEDULE_POST_FORM_NAME = "SchedulePost"
export const [SchedulePostFormProvider, useSchedulePostFormContext] = createPostFormContext<SchedulePost>()
