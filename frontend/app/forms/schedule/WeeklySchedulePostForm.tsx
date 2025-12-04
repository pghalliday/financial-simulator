import {useWeeklySchedulePostFormContext} from "~/forms/schedule/contexts";
import {TextInput} from "@mantine/core";
import {WeekdaySelect} from "~/components/controls/WeekdaySelect";

export function WeeklySchedulePostForm() {
    const form = useWeeklySchedulePostFormContext()
    return <>
        <TextInput
            autoFocus
            label="Name"
            description="DailySchedule name"
            placeholder="The unique schedule name"
            required
            key={form.key("name")}
            {...form.getInputProps("name")}
        />
        <TextInput
            label="Description"
            description="DailySchedule description"
            placeholder="The schedule description"
            key={form.key("description")}
            {...form.getInputProps("description")}
        />
        <WeekdaySelect
            label="Weekday"
            description="Weekday"
            placeholder="Weekday"
            key={form.key("weekday")}
            {...form.getInputProps("weekday")}
        />
    </>
}
