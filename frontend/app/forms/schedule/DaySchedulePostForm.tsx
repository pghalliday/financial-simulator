import {useDaySchedulePostFormContext} from "~/forms/schedule/contexts";
import {TextInput} from "@mantine/core";
import {DatePickerInput} from "@mantine/dates";

export function DaySchedulePostForm() {
    const form = useDaySchedulePostFormContext()
    return <>
        <TextInput
            autoFocus
            label="Name"
            description="Schedule name"
            placeholder="The unique schedule name"
            required
            key={form.key("name")}
            {...form.getInputProps("name")}
        />
        <TextInput
            label="Description"
            description="Schedule description"
            placeholder="The schedule description"
            key={form.key("description")}
            {...form.getInputProps("description")}
        />
        <DatePickerInput
            label="Day"
            description="Day"
            placeholder="Day"
            key={form.key("day")}
            {...form.getInputProps("day")}
        />
    </>
}
