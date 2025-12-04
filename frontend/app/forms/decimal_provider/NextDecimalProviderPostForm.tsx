import {useDecimalProviders} from "~/providers/items_providers";
import {TextInput} from "@mantine/core";
import {RelationMultiSelect} from "~/components/controls/RelationMultiSelect";
import {useNextDecimalProviderPostFormContext} from "~/forms/decimal_provider/contexts";

export function NextDecimalProviderPostForm() {
    const form = useNextDecimalProviderPostFormContext()
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
