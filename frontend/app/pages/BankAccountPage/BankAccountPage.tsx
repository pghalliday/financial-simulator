import {BankAccountPostFormProvider} from "~/forms/bank_account/BankAccountPostFormContext";
import {LedgerAccountPostFormProvider} from "~/forms/ledger_account/LedgerAccountPostFormContext";
import {useBankAccount} from "~/providers/item_providers";
import BankAccountPageForms from "~/pages/BankAccountPage/BankAccountPageForms";
import {Page} from "~/pages/common/Page";

export default function BankAccountPage() {
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
