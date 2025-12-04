import {useRangeSchedulePostFormContext} from "~/forms/schedule/contexts";
import {TextInput} from "@mantine/core";
import {DatePickerInput} from "@mantine/dates";

export function RangeSchedulePostForm() {
    const form = useRangeSchedulePostFormContext()
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
            label="From date"
            description="From date"
            placeholder="From date"
            key={form.key("from_date")}
            {...form.getInputProps("from_date")}
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
