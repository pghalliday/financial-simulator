import {ItemTextInput} from "~/components/controls/ItemTextInput";
import {type BankAccountPost, getItemsRouteLedgerAccountsGet, type LedgerAccountGet} from "~/client";
import {LedgerAccountSelector} from "~/components/controls/LedgerAccountSelector";
import {useEffect, useState} from "react";
import {callApi} from "~/lib/callApi";
import {GET_ITEMS_ERROR_TITLE} from "~/strings";

interface BankAccountPostFormProps {
    startLoading: () => void,
    stopLoading: () => void,
}

export function BankAccountPostForm({startLoading, stopLoading}: BankAccountPostFormProps) {
    const [ledgerAccounts, setLedgerAccounts] = useState<LedgerAccountGet[]>([])

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
        <LedgerAccountSelector<BankAccountPost, "asset_account_id">
            field="asset_account_id"
            ledgerAccounts={ledgerAccounts}
            label="Asset account"
            description={"Bank account asset ledger account"}
            placeholder="Asset account"
        />
        <LedgerAccountSelector<BankAccountPost, "interest_income_account_id">
            field="interest_income_account_id"
            ledgerAccounts={ledgerAccounts}
            label="Interest income account"
            description={"Bank account interest income ledger account"}
            placeholder="Interest income account"
        />
        <LedgerAccountSelector<BankAccountPost, "interest_receivable_account_id">
            field="interest_receivable_account_id"
            ledgerAccounts={ledgerAccounts}
            label="Interest receivable account"
            description={"Bank account interest receivable ledger account"}
            placeholder="Interest receivable account"
        />
        <LedgerAccountSelector<BankAccountPost, "fee_expenses_account_id">
            field="fee_expenses_account_id"
            ledgerAccounts={ledgerAccounts}
            label="Fee expenses account"
            description={"Bank account fee expenses ledger account"}
            placeholder="Fee expenses account"
        />
        <LedgerAccountSelector<BankAccountPost, "fees_payable_account_id">
            field="fees_payable_account_id"
            ledgerAccounts={ledgerAccounts}
            label="Fees payable account"
            description={"Bank account fees payable ledger account"}
            placeholder="Fees payable account"
        />
    </>
}