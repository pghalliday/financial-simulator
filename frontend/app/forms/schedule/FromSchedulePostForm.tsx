import {useFromSchedulePostFormContext} from "~/forms/schedule/contexts";
import {TextInput} from "@mantine/core";
import {DatePickerInput} from "@mantine/dates";

export function FromSchedulePostForm() {
    const form = useFromSchedulePostFormContext()
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
            label="From date"
            description="From date"
            placeholder="From date"
            key={form.key("from_date")}
            {...form.getInputProps("from_date")}
        />
    </>
}
