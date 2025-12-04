import {useMergeDecimalProviderPostFormContext} from "~/forms/decimal_provider/contexts";
import {TextInput} from "@mantine/core";
import {useDecimalProviders} from "~/providers/items_providers";
import {RelationMultiSelect} from "~/components/controls/RelationMultiSelect";

export function MergeDecimalProviderPostForm() {
    const form = useMergeDecimalProviderPostFormContext()
    const [decimalProviders] = useDecimalProviders()

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
            data={decimalProviders}
            label="Providers"
            description={"Providers"}
            placeholder="Providers"
            key={form.key("decimal_providers")}
            {...form.getInputProps("decimal_providers")}
        />
    </>
}
