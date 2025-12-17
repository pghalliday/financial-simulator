import {useCorporationEntityPostFormContext} from "~/forms/entity/contexts";
import {useBankAccounts, useScenarios} from "~/providers/items_providers";
import {RelationMultiSelect} from "~/components/controls/RelationMultiSelect";
import {TextInput} from "@mantine/core";
import {NamedRelationsSelect} from "~/components/controls/NamedRelationsSelect/NamedRelationsSelect";

export function CorporationEntityPostForm() {
    const form = useCorporationEntityPostFormContext()
    const [bankAccounts] = useBankAccounts()
    const [scenarios] = useScenarios()
    return <>
        <TextInput
            autoFocus
            label="Name"
            description="IndividualEntity name"
            placeholder="The unique entity name"
            required
            key={form.key("name")}
            {...form.getInputProps("name")}
        />
        <TextInput
            label="Description"
            description="IndividualEntity description"
            placeholder="The entity description"
            key={form.key("description")}
            {...form.getInputProps("description")}
        />
        <NamedRelationsSelect
            label="Bank accounts"
            description="Linked bank accounts"
            placeholder="Add entity bank accounts"
            relationHeading="Bank Account"
            data={bankAccounts}
            id={form.key("bank_accounts")}
            key={form.key("bank_accounts")}
            {...form.getInputProps("bank_accounts")}
        />
        <RelationMultiSelect
            label="Scenarios"
            description="Linked scenarios"
            placeholder="The entity scenarios"
            data={scenarios}
            key={form.key("scenarios")}
            {...form.getInputProps("scenarios")}
        />
    </>
}
