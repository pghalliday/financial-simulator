import {BankAccountPostFormProvider} from "~/forms/bank_account/contexts";
import {LedgerAccountPostFormProvider} from "~/forms/ledger_account/contexts";
import {useBankAccount} from "~/providers/item_providers";
import {Page} from "~/pages/Page";
import {BankAccountPageForms} from "~/pages/bank_accounts/forms/BankAccountPageForms";

export function BankAccountPage() {
    const [bankAccount, _putBankAccount, pageParams] = useBankAccount({})
    return <Page
        pageParams={pageParams}
    >
        <BankAccountPostFormProvider
            key={bankAccount?.id}
            initialValues={bankAccount}
        >
            <LedgerAccountPostFormProvider>
                <BankAccountPageForms/>
            </LedgerAccountPostFormProvider>
        </BankAccountPostFormProvider>
    </Page>
}
