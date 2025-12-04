import {useContinuousRatePostFormContext} from "~/forms/rate/contexts";
import {NumberInput, TextInput} from "@mantine/core";

export function ContinuousRatePostForm() {
    const form = useContinuousRatePostFormContext()
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
        <NumberInput
            label="Annual rate"
            description="Annual rate"
            placeholder="Annual rate"
            key={form.key("annual_rate")}
            {...form.getInputProps("annual_rate")}
        />
    </>
}
