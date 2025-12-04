import {createPostFormContext} from "~/providers/post_form_providers";
import type {
    AllSchedulePost,
    AnySchedulePost,
    DailySchedulePost,
    DaySchedulePost,
    FromSchedulePost,
    MonthlySchedulePost,
    RangeSchedulePost,
    UntilSchedulePost,
    WeeklySchedulePost,
    YearlySchedulePost
} from "../../../client";

export const [DailySchedulePostFormProvider, useDailySchedulePostFormContext] = createPostFormContext<DailySchedulePost>()
export const [DaySchedulePostFormProvider, useDaySchedulePostFormContext] = createPostFormContext<DaySchedulePost>()
export const [WeeklySchedulePostFormProvider, useWeeklySchedulePostFormContext] = createPostFormContext<WeeklySchedulePost>()
export const [MonthlySchedulePostFormProvider, useMonthlySchedulePostFormContext] = createPostFormContext<MonthlySchedulePost>()
export const [YearlySchedulePostFormProvider, useYearlySchedulePostFormContext] = createPostFormContext<YearlySchedulePost>()
export const [FromSchedulePostFormProvider, useFromSchedulePostFormContext] = createPostFormContext<FromSchedulePost>()
export const [UntilSchedulePostFormProvider, useUntilSchedulePostFormContext] = createPostFormContext<UntilSchedulePost>()
export const [RangeSchedulePostFormProvider, useRangeSchedulePostFormContext] = createPostFormContext<RangeSchedulePost>()
export const [AllSchedulePostFormProvider, useAllSchedulePostFormContext] = createPostFormContext<AllSchedulePost>()
export const [AnySchedulePostFormProvider, useAnySchedulePostFormContext] = createPostFormContext<AnySchedulePost>()
