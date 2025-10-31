import {BANK_ACCOUNTS_BREADCRUMBS, BANK_ACCOUNTS_PAGE_DESCRIPTION, BANK_ACCOUNTS_PAGE_TITLE} from "~/strings";
import {Page} from "~/pages/common/Page";
import {BankAccountList} from "~/lists/BankAccountList";
import {BankAccountPostFormProvider} from "~/forms/bank_account/BankAccountPostFormContext";
import {LedgerAccountPostFormProvider} from "~/forms/ledger_account/LedgerAccountPostFormContext";
import {useBankAccounts} from "~/providers/items_providers";
import {useLedgerAccountTree} from "~/providers/tree_providers";

export default function BankAccountsPage() {
    const [bankAccounts, setBankAccounts] = useBankAccounts()
    const [ledgerAccountTree, setLedgerAccountTree] = useLedgerAccountTree()
    return <Page
        pageParams={{
            title: BANK_ACCOUNTS_PAGE_TITLE,
            description: BANK_ACCOUNTS_PAGE_DESCRIPTION,
            breadcrumbs: BANK_ACCOUNTS_BREADCRUMBS,
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
