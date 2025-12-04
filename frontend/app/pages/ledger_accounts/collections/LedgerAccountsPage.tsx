import {Page} from "~/pages/Page";
import {LedgerAccountList} from "~/lists/ledger_accounts/LedgerAccountList";
import {LedgerAccountPostFormProvider} from "~/forms/ledger_account/contexts";
import {useLedgerAccounts} from "~/providers/items_providers";
import {LEDGER_ACCOUNT_PARAMS} from "~/page_params/ledger_accounts";

export function LedgerAccountsPage() {
    const [ledgerAccounts, setLedgerAccounts] = useLedgerAccounts()
    return <Page
        pageParams={{
            title: LEDGER_ACCOUNT_PARAMS.collectionPageTitle,
            description: LEDGER_ACCOUNT_PARAMS.collectionPageDescription,
            breadcrumbs: LEDGER_ACCOUNT_PARAMS.collectionBreadcrumbs,
        }}
    >
        <LedgerAccountPostFormProvider>
            <LedgerAccountList ledgerAccounts={ledgerAccounts} onChange={setLedgerAccounts}/>
        </LedgerAccountPostFormProvider>
    </Page>
}
