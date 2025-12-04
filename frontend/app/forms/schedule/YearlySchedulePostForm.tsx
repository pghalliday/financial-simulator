import {useYearlySchedulePostFormContext} from "~/forms/schedule/contexts";
import {NumberInput, TextInput} from "@mantine/core";
import {MonthSelect} from "~/components/controls/MonthSelect";

export function YearlySchedulePostForm() {
    const form = useYearlySchedulePostFormContext()
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
        <MonthSelect
            label="Month"
            description="Month"
            placeholder="Month"
            key={form.key("month")}
            {...form.getInputProps("month")}
        />
        <NumberInput
            label="Day"
            description="Day"
            placeholder="Day"
            allowDecimal={false}
            min={1}
            max={31}
            key={form.key("day")}
            {...form.getInputProps("day")}
        />
    </>
}
