import {ItemTextInput} from "~/components/controls/ItemTextInput";
import {type BankAccountPost, getItemsRouteLedgerAccountsGet, type LedgerAccountGet} from "~/client";
import {useCallback, useEffect, useState} from "react";
import {callApi} from "~/lib/callApi";
import {GET_ITEMS_ERROR_TITLE} from "~/strings";
import {EMPTY_TREE_DATA, type TreeData, TreeSelector} from "~/components/controls/TreeSelector";

interface BankAccountPostFormProps {
    startLoading: () => void,
    stopLoading: () => void,
}

function compileLedgerAccountTreeData(ledgerAccount: LedgerAccountGet, parent: string, parent_path: string[]): TreeData {
    const path = [...parent_path, ledgerAccount.id]
    let data = {
        [ledgerAccount.id]: {
            id: ledgerAccount.id,
            label: ledgerAccount.account_name,
            children: ledgerAccount.sub_accounts.map(ledgerAccountNode => ledgerAccountNode.id),
            parent,
            path,
        },
    }
    for (const child of ledgerAccount.sub_accounts) {
        data = {
            ...data,
            ...compileLedgerAccountTreeData(child, ledgerAccount.id, path)
        }
    }
    return data
}

function getLedgerAccountTreeData(ledgerAccounts: LedgerAccountGet[]): TreeData {
    const id = ""
    const label = ""
    const children = ledgerAccounts.map(ledgerAccount => ledgerAccount.id)
    const parent = ""
    const path: string[] = []
    let data = {[id]: {id, label, parent, children, path}}
    for (const ledgerAccount of ledgerAccounts) {
        data = {
            ...data,
            ...compileLedgerAccountTreeData(ledgerAccount, id, path),
        }
    }
    return data
}

const ADD_NEW_LEDGER_ACCOUNT_PROMPT = "Add new ledger account..."

export function BankAccountPostForm({startLoading, stopLoading}: BankAccountPostFormProps) {
    const [ledgerAccounts, setLedgerAccounts] = useState<LedgerAccountGet[]>([])
    const [ledgerAccountTreeData, setLedgerAccountTreeData] = useState<TreeData>(EMPTY_TREE_DATA)

    useEffect(() => {
        callApi({
            api: () => getItemsRouteLedgerAccountsGet({
                query: {
                    depth: -1,
                    max_parents: 0,
                },
            }),
            errorTitle: GET_ITEMS_ERROR_TITLE,
            onSuccess: setLedgerAccounts,
            begin: startLoading,
            end: stopLoading,
        });
    }, []);

    useEffect(() => {
        setLedgerAccountTreeData(getLedgerAccountTreeData(ledgerAccounts))
    }, [ledgerAccounts]);

    const addLedgerAccount = useCallback((account_name: string, parent_id?: string) => {
        console.log(account_name, parent_id)
    }, [ledgerAccounts])

    return <>
        <ItemTextInput<BankAccountPost, "name">
            field="name"
            label="Name"
            description={"Bank account name"}
            placeholder="Name"
            required
        />
        <ItemTextInput<BankAccountPost, "description">
            field="description"
            label="Description"
            description={"Bank account description"}
            placeholder="Description"
        />
        <TreeSelector<BankAccountPost, "asset_account_id">
            field="asset_account_id"
            data={ledgerAccountTreeData}
            onCreate={addLedgerAccount}
            createPrompt={ADD_NEW_LEDGER_ACCOUNT_PROMPT}
            label="Asset account"
            description={"Bank account asset ledger account"}
            placeholder="Asset account"
        />
        <TreeSelector<BankAccountPost, "interest_income_account_id">
            field="interest_income_account_id"
            data={ledgerAccountTreeData}
            onCreate={addLedgerAccount}
            createPrompt={ADD_NEW_LEDGER_ACCOUNT_PROMPT}
            label="Interest income account"
            description={"Bank account interest income ledger account"}
            placeholder="Interest income account"
        />
        <TreeSelector<BankAccountPost, "interest_receivable_account_id">
            field="interest_receivable_account_id"
            data={ledgerAccountTreeData}
            onCreate={addLedgerAccount}
            createPrompt={ADD_NEW_LEDGER_ACCOUNT_PROMPT}
            label="Interest receivable account"
            description={"Bank account interest receivable ledger account"}
            placeholder="Interest receivable account"
        />
        <TreeSelector<BankAccountPost, "fee_expenses_account_id">
            field="fee_expenses_account_id"
            data={ledgerAccountTreeData}
            onCreate={addLedgerAccount}
            createPrompt={ADD_NEW_LEDGER_ACCOUNT_PROMPT}
            label="Fee expenses account"
            description={"Bank account fee expenses ledger account"}
            placeholder="Fee expenses account"
        />
        <TreeSelector<BankAccountPost, "fees_payable_account_id">
            field="fees_payable_account_id"
            data={ledgerAccountTreeData}
            onCreate={addLedgerAccount}
            createPrompt={ADD_NEW_LEDGER_ACCOUNT_PROMPT}
            label="Fees payable account"
            description={"Bank account fees payable ledger account"}
            placeholder="Fees payable account"
        />
    </>
}