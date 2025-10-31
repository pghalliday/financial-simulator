import {type LedgerAccountGet, type LedgerAccountPost} from "~/client";
import {useCallback} from "react";
import {BANK_ACCOUNT_POST_FORM_NAME} from "~/forms/bank_account/BankAccountPostFormContext";
import type {TreeData} from "~/lib/TreeData";
import {BoundTextInput} from "~/components/controls/bound/BoundTextInput";
import {BoundTreeSelect} from "~/components/controls/bound/BoundTreeSelect";

interface BankAccountPostFormProps {
    ledgerAccountTree: TreeData<LedgerAccountGet>
    onAddLedgerAccount: (initialValues: LedgerAccountPost) => void,
}

const ADD_NEW_LEDGER_ACCOUNT_PROMPT = "Add new ledger account..."

export function BankAccountPostForm({ledgerAccountTree, onAddLedgerAccount}: BankAccountPostFormProps) {
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
        <BoundTextInput
            formName={BANK_ACCOUNT_POST_FORM_NAME}
            fieldName="name"
            label="Name"
            description="Bank account name"
            placeholder="The unique bank account name"
            required
        />
        <BoundTextInput
            formName={BANK_ACCOUNT_POST_FORM_NAME}
            fieldName="description"
            label="Description"
            description="Bank account description"
            placeholder="The bank account description"
        />
        <BoundTreeSelect
            formName={BANK_ACCOUNT_POST_FORM_NAME}
            fieldName="asset_account_id"
            data={ledgerAccountTree}
            onCreate={addLedgerAccount}
            createPrompt={ADD_NEW_LEDGER_ACCOUNT_PROMPT}
            label="Asset account"
            description={"Bank account asset ledger account"}
            placeholder="Asset account"
        />
        <BoundTreeSelect
            formName={BANK_ACCOUNT_POST_FORM_NAME}
            fieldName="interest_income_account_id"
            data={ledgerAccountTree}
            onCreate={addLedgerAccount}
            createPrompt={ADD_NEW_LEDGER_ACCOUNT_PROMPT}
            label="Interest income account"
            description={"Bank account interest income ledger account"}
            placeholder="Interest income account"
        />
        <BoundTreeSelect
            formName={BANK_ACCOUNT_POST_FORM_NAME}
            fieldName="interest_receivable_account_id"
            data={ledgerAccountTree}
            onCreate={addLedgerAccount}
            createPrompt={ADD_NEW_LEDGER_ACCOUNT_PROMPT}
            label="Interest receivable account"
            description={"Bank account interest receivable ledger account"}
            placeholder="Interest receivable account"
        />
        <BoundTreeSelect
            formName={BANK_ACCOUNT_POST_FORM_NAME}
            fieldName="fee_expenses_account_id"
            data={ledgerAccountTree}
            onCreate={addLedgerAccount}
            createPrompt={ADD_NEW_LEDGER_ACCOUNT_PROMPT}
            label="Fee expenses account"
            description={"Bank account fee expenses ledger account"}
            placeholder="Fee expenses account"
        />
        <BoundTreeSelect
            formName={BANK_ACCOUNT_POST_FORM_NAME}
            fieldName="fees_payable_account_id"
            data={ledgerAccountTree}
            onCreate={addLedgerAccount}
            createPrompt={ADD_NEW_LEDGER_ACCOUNT_PROMPT}
            label="Fees payable account"
            description={"Bank account fees payable ledger account"}
            placeholder="Fees payable account"
        />
    </>
}