import {LEDGER_ACCOUNTS_BREADCRUMBS, LEDGER_ACCOUNTS_PAGE_DESCRIPTION, LEDGER_ACCOUNTS_PAGE_TITLE} from "~/strings";
import {Page} from "~/pages/common/Page";
import {LedgerAccountList} from "~/lists/LedgerAccountList";
import {LedgerAccountPostFormProvider} from "~/forms/ledger_account/LedgerAccountPostFormContext";
import {useLedgerAccounts} from "~/providers/items_providers";

export default function LedgerAccountsPage() {
    const [ledgerAccounts, setLedgerAccounts] = useLedgerAccounts()
    return <Page
        pageParams={{
            title: LEDGER_ACCOUNTS_PAGE_TITLE,
            description: LEDGER_ACCOUNTS_PAGE_DESCRIPTION,
            breadcrumbs: LEDGER_ACCOUNTS_BREADCRUMBS,
        }}
    >
        <LedgerAccountPostFormProvider>
            <LedgerAccountList ledgerAccounts={ledgerAccounts} onChange={setLedgerAccounts}/>
        </LedgerAccountPostFormProvider>
    </Page>
}
