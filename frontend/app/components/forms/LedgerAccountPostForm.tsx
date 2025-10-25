import {ItemTextInput} from "~/components/controls/ItemTextInput";
import type {LedgerAccountGet, LedgerAccountPost} from "~/client";
import type {ItemPostFieldGetter, ItemPostFieldSetter} from "~/lib/hooks/useItemPost";
import {Title} from "@mantine/core";

export function LedgerAccountPostForm({
                                          parent,
                                          getField,
                                          setField,
                                      }: {
    parent?: LedgerAccountGet,
    getField: ItemPostFieldGetter<LedgerAccountPost>,
    setField: ItemPostFieldSetter<LedgerAccountPost>,
}) {
    const parentIndicator = parent === undefined ? "Top level account" : `Parent: ${parent.name}`
    return <>
        <Title order={4}>{parentIndicator}</Title>
        <ItemTextInput<LedgerAccountPost, "name">
            field="name"
            getField={getField}
            setField={setField}
            label="Name"
            description={"Ledger account unique name"}
            placeholder="Name"
            required
        />
        <ItemTextInput<LedgerAccountPost, "account_name">
            field="account_name"
            getField={getField}
            setField={setField}
            label="Account Name"
            description={"Ledger account name (unique to the parent account)"}
            placeholder="Name"
            required
        />
        <ItemTextInput<LedgerAccountPost, "description">
            field="description"
            getField={getField}
            setField={setField}
            label="Description"
            description={"Ledger account description"}
            placeholder="Description"
        />
    </>
}
