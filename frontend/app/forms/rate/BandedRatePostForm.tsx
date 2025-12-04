import {useBandedRatePostFormContext} from "~/forms/rate/contexts";
import {TextInput} from "@mantine/core";

export function BandedRatePostForm() {
    const form = useBandedRatePostFormContext()
    return <>
        <TextInput
            autoFocus
            label="Name"
            description="PeriodicRate name"
            placeholder="The unique rate name"
            required
            key={form.key("name")}
            {...form.getInputProps("name")}
        />
        <TextInput
            label="Description"
            description="PeriodicRate description"
            placeholder="The rate description"
            key={form.key("description")}
            {...form.getInputProps("description")}
        />
    </>
}
