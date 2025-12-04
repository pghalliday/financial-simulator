import {useScheduledRateProviderPostFormContext} from "~/forms/rate_provider/contexts";
import {TextInput} from "@mantine/core";
import {useRates, useSchedules} from "~/providers/items_providers";
import {RelationSelect} from "~/components/controls/RelationSelect";

export function ScheduledRateProviderPostForm() {
    const form = useScheduledRateProviderPostFormContext()
    const [schedules] = useSchedules()
    const [rates] = useRates()
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
        <RelationSelect
            data={rates}
            label="PeriodicRate"
            description={"PeriodicRate"}
            placeholder="PeriodicRate"
            key={form.key("rate_id")}
            {...form.getInputProps("rate_id")}
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
