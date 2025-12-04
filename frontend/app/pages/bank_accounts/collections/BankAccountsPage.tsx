import {Page} from "~/pages/Page";
import {BankAccountList} from "~/lists/bank_accounts/BankAccountList";
import {BankAccountPostFormProvider} from "~/forms/bank_account/contexts";
import {LedgerAccountPostFormProvider} from "~/forms/ledger_account/contexts";
import {useBankAccounts} from "~/providers/items_providers";
import {useLedgerAccountTree} from "~/providers/tree_providers";
import {BANK_ACCOUNT_PARAMS} from "~/page_params/bank_accounts";

export function BankAccountsPage() {
    const [bankAccounts, setBankAccounts] = useBankAccounts()
    const [ledgerAccountTree, setLedgerAccountTree] = useLedgerAccountTree()
    return <Page
        pageParams={{
            title: BANK_ACCOUNT_PARAMS.collectionPageTitle,
            description: BANK_ACCOUNT_PARAMS.collectionPageDescription,
            breadcrumbs: BANK_ACCOUNT_PARAMS.collectionBreadcrumbs,
        }}
    >
        <BankAccountPostFormProvider>
            <LedgerAccountPostFormProvider>
                <BankAccountList
                    bankAccounts={bankAccounts}
                    onBankAccountsChange={setBankAccounts}
                    ledgerAccountTree={ledgerAccountTree}
                    onLedgerAccountTreeChange={setLedgerAccountTree}
                />
            </LedgerAccountPostFormProvider>
        </BankAccountPostFormProvider>
    </Page>
}
