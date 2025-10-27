import {ItemTextInput} from "~/components/controls/ItemTextInput";
import type {LedgerAccountGet, LedgerAccountPost} from "~/client";
import {Title} from "@mantine/core";

export function LedgerAccountPostForm({
                                          parent,
                                      }: {
    parent?: LedgerAccountGet | null,
}) {
    const parentIndicator = parent === undefined ? "" : parent === null ? "Top level account" : `Parent: ${parent.name}`
    return <>
        <Title order={4}>{parentIndicator}</Title>
        <ItemTextInput<LedgerAccountPost, "name">
            field="name"
            label="Name"
            description={"Ledger account unique name"}
            placeholder="Name"
            required
        />
        <ItemTextInput<LedgerAccountPost, "account_name">
            field="account_name"
            label="Account Name"
            description={"Ledger account name (unique to the parent account)"}
            placeholder="Name"
            required
        />
        <ItemTextInput<LedgerAccountPost, "description">
            field="description"
            label="Description"
            description={"Ledger account description"}
            placeholder="Description"
        />
    </>
}
