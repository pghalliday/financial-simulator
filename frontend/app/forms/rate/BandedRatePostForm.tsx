import {useBandedRatePostFormContext} from "~/forms/rate/contexts";
import {TextInput} from "@mantine/core";
import {RateBandsSelect} from "~/components/controls/RateBandsSelect";

export function BandedRatePostForm() {
    const form = useBandedRatePostFormContext()
    return <>
        <TextInput
            autoFocus
            label="Name"
            description="Rate name"
            placeholder="The unique rate name"
            required
            key={form.key("name")}
            {...form.getInputProps("name")}
        />
        <TextInput
            label="Description"
            description="Rate description"
            placeholder="The rate description"
            key={form.key("description")}
            {...form.getInputProps("description")}
        />
        <RateBandsSelect
            label="Bands"
            description="Rate bands"
            key={form.key("banded_rate_bands")}
            {...form.getInputProps("banded_rate_bands")}
        />
    </>
}
