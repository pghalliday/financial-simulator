import {ItemPageForm} from "~/pages/ItemPageForm";
import {LedgerAccountPostForm} from "~/forms/ledger_account/LedgerAccountPostForm";
import {useLedgerAccountPostFormContext} from "~/forms/ledger_account/contexts";
import {useLedgerAccount} from "~/providers/item_providers";

export function LedgerAccountPageForms() {
    const form = useLedgerAccountPostFormContext()
    const [ledgerAccount, putLedgerAccount] = useLedgerAccount({
        onPutSuccess: ledgerAccount => {
            form.setInitialValues(ledgerAccount)
        }
    })

    return <ItemPageForm
        onSubmit={form.onSubmit(putLedgerAccount)}
        onReset={form.onReset}
    >
        <LedgerAccountPostForm parent={ledgerAccount?.parent}/>
    </ItemPageForm>
}
