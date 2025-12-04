import type {LedgerAccountParentGet} from "../../../client";
import {TextInput, Title} from "@mantine/core";
import {useLedgerAccountPostFormContext} from "~/forms/ledger_account/contexts";

export function LedgerAccountPostForm(
    {
        parent
    }: {
        parent?: LedgerAccountParentGet | null,
    }
) {
    const form = useLedgerAccountPostFormContext()
    const parentIndicator = parent === undefined ? "" : parent === null ? "Top level account" : `Parent: ${parent.name}`
    return <>
        <Title order={4}>{parentIndicator}</Title>
        <TextInput
            autoFocus
            label="Name"
            description="Ledger account unique name"
            placeholder="The unique ledger account name"
            required
            key={form.key("name")}
            {...form.getInputProps("name")}
        />
        <TextInput
            label="Account name"
            description="Ledger account name"
            placeholder="The ledger account name"
            required
            key={form.key("account_name")}
            {...form.getInputProps("account_name")}
        />
        <TextInput
            label="Description"
            description="Ledger account description"
            placeholder="The ledger account description"
            key={form.key("description")}
            {...form.getInputProps("description")}
        />
    </>
}
