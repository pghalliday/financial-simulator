import {useBankAccounts, useScenarios} from "~/providers/items_providers";
import {TextInput} from "@mantine/core";
import {RelationMultiSelect} from "~/components/controls/RelationMultiSelect";
import {useIndividualEntityPostFormContext} from "~/forms/entity/contexts";

export function IndividualEntityPostForm() {
    const form = useIndividualEntityPostFormContext()
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
        <RelationMultiSelect
            label="Bank accounts"
            description="Linked bank accounts"
            placeholder="The entity bank accounts"
            data={bankAccounts}
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
