import {useSchedules} from "~/providers/items_providers";
import {NumberInput, TextInput} from "@mantine/core";
import {useScheduledDecimalProviderPostFormContext} from "~/forms/decimal_provider/contexts";
import {RelationSelect} from "~/components/controls/RelationSelect";

export function ScheduledDecimalProviderPostForm() {
    const form = useScheduledDecimalProviderPostFormContext()
    const [schedules] = useSchedules()

    return <>
        <TextInput
            autoFocus
            label="Name"
            description="Provider name"
            placeholder="The unique provider name"
            required
            key={form.key("name")}
            {...form.getInputProps("name")}
        />
        <TextInput
            label="Description"
            description="Provider description"
            placeholder="The provider description"
            key={form.key("description")}
            {...form.getInputProps("description")}
        />
        <NumberInput
            label="Value"
            description={"Value"}
            placeholder="Value"
            key={form.key("value")}
            {...form.getInputProps("value")}
        />
        <RelationSelect
            data={schedules}
            label="DailySchedule"
            description={"DailySchedule"}
            placeholder="DailySchedule"
            key={form.key("schedule_id")}
            {...form.getInputProps("schedule_id")}
        />
    </>
}
