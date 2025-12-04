import {type LedgerAccountGet, type LedgerAccountPost} from "../../../client";
import {useCallback} from "react";
import {useBankAccountPostFormContext} from "~/forms/bank_account/contexts";
import type {TreeData} from "~/lib/TreeData";
import {useDecimalProviders, useRateProviders, useSchedules} from "~/providers/items_providers";
import {TextInput} from "@mantine/core";
import {TreeSelect} from "~/components/controls/TreeSelect/TreeSelect";
import {RelationSelect} from "~/components/controls/RelationSelect";

interface BankAccountPostFormProps {
    ledgerAccountTree: TreeData<LedgerAccountGet>
    onAddLedgerAccount: (initialValues: LedgerAccountPost) => void,
}

const ADD_NEW_LEDGER_ACCOUNT_PROMPT = "Add new ledger account..."

export function BankAccountPostForm(
    {
        ledgerAccountTree,
        onAddLedgerAccount,
    }: BankAccountPostFormProps
) {
    const form = useBankAccountPostFormContext()
    const [rateProviders] = useRateProviders()
    const [decimalProviders] = useDecimalProviders()
    const [schedules] = useSchedules()

    const addLedgerAccount = useCallback((account_name: string, parentPath: LedgerAccountGet[]) => {
        const parent_id = parentPath.length === 0 ? undefined : parentPath[parentPath.length - 1].id
        const name = [
            ...parentPath.map(
                ledgerAccountGet => ledgerAccountGet.account_name
            ),
            account_name
        ].join(" - ")
        const initialValues: LedgerAccountPost = {
            parent_id,
            name,
            account_name,
            description: "",
        }
        onAddLedgerAccount(initialValues)
    }, [ledgerAccountTree, onAddLedgerAccount])

    return <>
        <TextInput
            autoFocus
            label="Name"
            description="Bank account name"
            placeholder="The unique bank account name"
            required
            key={form.key("name")}
            {...form.getInputProps("name")}
        />
        <TextInput
            label="Description"
            description="Bank account description"
            placeholder="The bank account description"
            key={form.key("description")}
            {...form.getInputProps("description")}
        />
        <TreeSelect
            data={ledgerAccountTree}
            onCreate={addLedgerAccount}
            createPrompt={ADD_NEW_LEDGER_ACCOUNT_PROMPT}
            label="Asset account"
            description={"Bank account asset ledger account"}
            placeholder="Asset account"
            key={form.key("asset_account_id")}
            {...form.getInputProps("asset_account_id")}
        />
        <TreeSelect
            data={ledgerAccountTree}
            onCreate={addLedgerAccount}
            createPrompt={ADD_NEW_LEDGER_ACCOUNT_PROMPT}
            label="Interest income account"
            description={"Bank account interest income ledger account"}
            placeholder="Interest income account"
            key={form.key("interest_income_account_id")}
            {...form.getInputProps("interest_income_account_id")}
        />
        <TreeSelect
            data={ledgerAccountTree}
            onCreate={addLedgerAccount}
            createPrompt={ADD_NEW_LEDGER_ACCOUNT_PROMPT}
            label="Interest receivable account"
            description={"Bank account interest receivable ledger account"}
            placeholder="Interest receivable account"
            key={form.key("interest_receivable_account_id")}
            {...form.getInputProps("interest_receivable_account_id")}
        />
        <TreeSelect
            data={ledgerAccountTree}
            onCreate={addLedgerAccount}
            createPrompt={ADD_NEW_LEDGER_ACCOUNT_PROMPT}
            label="Fee expenses account"
            description={"Bank account fee expenses ledger account"}
            placeholder="Fee expenses account"
            key={form.key("fee_expenses_account_id")}
            {...form.getInputProps("fee_expenses_account_id")}
        />
        <TreeSelect
            data={ledgerAccountTree}
            onCreate={addLedgerAccount}
            createPrompt={ADD_NEW_LEDGER_ACCOUNT_PROMPT}
            label="Fees payable account"
            description={"Bank account fees payable ledger account"}
            placeholder="Fees payable account"
            key={form.key("fees_payable_account_id")}
            {...form.getInputProps("fees_payable_account_id")}
        />
        <RelationSelect
            data={decimalProviders}
            label="Fees provider"
            description={"Bank account fees provider"}
            placeholder="Fees provider"
            key={form.key("fees_provider_id")}
            {...form.getInputProps("fees_provider_id")}
        />
        <RelationSelect
            data={schedules}
            label="Fee payment schedule"
            description={"Bank account fee payment schedule"}
            placeholder="Fee payment schedule"
            key={form.key("fee_payment_schedule_id")}
            {...form.getInputProps("fee_payment_schedule_id")}
        />
        <RelationSelect
            data={rateProviders}
            label="Interest rate provider"
            description={"Bank account interest rate provider"}
            placeholder="Interest rate provider"
            key={form.key("interest_rate_provider_id")}
            {...form.getInputProps("interest_rate_provider_id")}
        />
        <RelationSelect
            data={schedules}
            label="Interest payment schedule"
            description={"Bank account interest payment schedule"}
            placeholder="Interest payment schedule"
            key={form.key("interest_payment_schedule_id")}
            {...form.getInputProps("interest_payment_schedule_id")}
        />
    </>
}