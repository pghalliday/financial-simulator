import {useUntilSchedulePostFormContext} from "~/forms/schedule/contexts";
import {TextInput} from "@mantine/core";
import {DatePickerInput} from "@mantine/dates";

export function UntilSchedulePostForm() {
    const form = useUntilSchedulePostFormContext()
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
        <DatePickerInput
            label="Until date"
            description="Until date"
            placeholder="Until date"
            key={form.key("until_date")}
            {...form.getInputProps("until_date")}
        />
    </>
}
