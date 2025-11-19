import type {LedgerAccountParentGet} from "~/client";
import {Title} from "@mantine/core";
import {BoundTextInput} from "~/components/controls/bound/BoundTextInput";
import {LEDGER_ACCOUNT_POST_FORM_NAME} from "~/forms/ledger_account/LedgerAccountPostFormContext";

export function LedgerAccountPostForm({
                                          parent,
                                      }: {
    parent?: LedgerAccountParentGet | null,
}) {
    const parentIndicator = parent === undefined ? "" : parent === null ? "Top level account" : `Parent: ${parent.name}`
    return <>
        <Title order={4}>{parentIndicator}</Title>
        <BoundTextInput
            formName={LEDGER_ACCOUNT_POST_FORM_NAME}
            fieldName="name"
            label="Name"
            description="Ledger account unique name"
            placeholder="The unique ledger account name"
            required
        />
        <BoundTextInput
            formName={LEDGER_ACCOUNT_POST_FORM_NAME}
            fieldName="account_name"
            label="Account name"
            description="Ledger account name"
            placeholder="The ledger account name"
            required
        />
        <BoundTextInput
            formName={LEDGER_ACCOUNT_POST_FORM_NAME}
            fieldName="description"
            label="Description"
            description="Ledger account description"
            placeholder="The ledger account description"
        />
    </>
}
