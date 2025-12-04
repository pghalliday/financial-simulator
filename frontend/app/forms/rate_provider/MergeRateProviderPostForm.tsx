import {useMergeRateProviderPostFormContext} from "~/forms/rate_provider/contexts";
import {useRateProviders} from "~/providers/items_providers";
import {TextInput} from "@mantine/core";
import {RelationMultiSelect} from "~/components/controls/RelationMultiSelect";

export function MergeRateProviderPostForm() {
    const form = useMergeRateProviderPostFormContext()
    const [rateProviders] = useRateProviders()

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
        <RelationMultiSelect
            data={rateProviders}
            label="Providers"
            description={"Providers"}
            placeholder="Providers"
            key={form.key("rate_providers")}
            {...form.getInputProps("rate_providers")}
        />
    </>
}
