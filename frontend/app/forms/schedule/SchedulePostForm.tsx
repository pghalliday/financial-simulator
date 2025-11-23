import {Title} from "@mantine/core";
import {SCHEDULE_TYPES} from "~/strings";
import {BoundTextInput} from "~/components/controls/bound/BoundTextInput";
import {BoundSelect} from "~/components/controls/bound/BoundSelect";
import {SCHEDULE_POST_FORM_NAME, useSchedulePostFormContext} from "~/forms/schedule/SchedulePostFormContext";
import {AllSchedulePostForm} from "~/forms/schedule/AllSchedulePostForm";
import {AnySchedulePostForm} from "~/forms/schedule/AnySchedulePostForm";
import {DailySchedulePostForm} from "~/forms/schedule/DailySchedulePostForm";
import {DaySchedulePostForm} from "~/forms/schedule/DaySchedulePostForm";
import {FromSchedulePostForm} from "~/forms/schedule/FromSchedulePostForm";
import {UntilSchedulePostForm} from "~/forms/schedule/UntilSchedulePostForm";
import {WeeklySchedulePostForm} from "~/forms/schedule/WeeklySchedulePostForm";
import {MonthlySchedulePostForm} from "~/forms/schedule/MonthlySchedulePostForm";
import {YearlySchedulePostForm} from "~/forms/schedule/YearlySchedulePostForm";
import {RangeSchedulePostForm} from "~/forms/schedule/RangeSchedulePostForm";

export interface Props {
    allowSelectType?: boolean,
}

const TYPE_SELECT_DATA = Object.entries(SCHEDULE_TYPES).map(entry => ({
    value: entry[0],
    label: entry[1],
}))

export function SchedulePostForm({allowSelectType = false}: Props) {
    const form = useSchedulePostFormContext()
    return <>
        {allowSelectType ? (
            <BoundSelect
                formName={SCHEDULE_POST_FORM_NAME}
                fieldName="type"
                label="Type"
                description="Schedule type"
                placeholder="Select the schedule type"
                data={TYPE_SELECT_DATA}
                required
            />
        ) : (
            <Title order={4}>{SCHEDULE_TYPES[form.getValues().type]}</Title>
        )}
        <BoundTextInput
            formName={SCHEDULE_POST_FORM_NAME}
            fieldName="name"
            label="Name"
            description="Schedule name"
            placeholder="The unique schedule name"
            required
        />
        <BoundTextInput
            formName={SCHEDULE_POST_FORM_NAME}
            fieldName="description"
            label="Description"
            description="Schedule description"
            placeholder="The schedule description"
        />
        {(() => {
            switch (form.getValues().type) {
                case "all_schedule":
                    return <AllSchedulePostForm/>
                case "any_schedule":
                    return <AnySchedulePostForm/>
                case "daily_schedule":
                    return <DailySchedulePostForm/>
                case "day_schedule":
                    return <DaySchedulePostForm/>
                case "from_schedule":
                    return <FromSchedulePostForm/>
                case "until_schedule":
                    return <UntilSchedulePostForm/>
                case "range_schedule":
                    return <RangeSchedulePostForm/>
                case "weekly_schedule":
                    return <WeeklySchedulePostForm/>
                case "monthly_schedule":
                    return <MonthlySchedulePostForm/>
                case "yearly_schedule":
                    return <YearlySchedulePostForm/>
            }
        })()}
    </>
}
