import {useAllSchedulePostFormContext} from "~/forms/schedule/contexts";
import {TextInput} from "@mantine/core";
import {RelationMultiSelect} from "~/components/controls/RelationMultiSelect";
import {useSchedules} from "~/providers/items_providers";

export function AllSchedulePostForm() {
    const form = useAllSchedulePostFormContext()
    const [schedules] = useSchedules()
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
        <RelationMultiSelect
            data={schedules}
            label="Schedules"
            description={"Schedules"}
            placeholder="Schedules"
            key={form.key("schedules")}
            {...form.getInputProps("schedules")}
        />
    </>
}
