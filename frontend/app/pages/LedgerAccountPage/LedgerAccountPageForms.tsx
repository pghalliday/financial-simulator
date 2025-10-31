import {ItemPageForm} from "~/pages/common/ItemPageForm";
import {LedgerAccountPostForm} from "~/forms/ledger_account/LedgerAccountPostForm";
import {LEDGER_ACCOUNT_POST_FORM_NAME} from "~/forms/ledger_account/LedgerAccountPostFormContext";
import {useLedgerAccount} from "~/providers/item_providers";
import {useFormContext} from "~/lib/hooks/useFormContext";

export default function LedgerAccountPageForms() {
    const form = useFormContext(LEDGER_ACCOUNT_POST_FORM_NAME)
    const [ledgerAccount, putLedgerAccount] = useLedgerAccount({
        onPutSuccess: ledgerAccount => {
            form.setInitialValues(ledgerAccount)
        }
    })

    return <ItemPageForm
        formName={LEDGER_ACCOUNT_POST_FORM_NAME}
        onSubmit={putLedgerAccount}
    >
        <LedgerAccountPostForm parent={ledgerAccount?.parent}/>
    </ItemPageForm>
}
