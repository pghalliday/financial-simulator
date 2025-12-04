import {useDailySchedulePostFormContext} from "~/forms/schedule/contexts";
import {TextInput} from "@mantine/core";

export function DailySchedulePostForm() {
    const form = useDailySchedulePostFormContext()
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
    </>
}
