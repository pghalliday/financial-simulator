import {useMonthlySchedulePostFormContext} from "~/forms/schedule/contexts";
import {NumberInput, TextInput} from "@mantine/core";

export function MonthlySchedulePostForm() {
    const form = useMonthlySchedulePostFormContext()
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
        <NumberInput
            label="Month day"
            description="Month day"
            placeholder="Month day"
            allowDecimal={false}
            min={1}
            max={31}
            key={form.key("day")}
            {...form.getInputProps("day")}
        />
    </>
}
