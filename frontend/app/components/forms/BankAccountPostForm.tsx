import {ItemTextInput} from "~/components/controls/ItemTextInput";
import type {BankAccountPost} from "~/client";
import {LedgerAccountSelector} from "~/components/controls/LedgerAccountSelector";
import type {ItemPostFieldGetter, ItemPostFieldSetter} from "~/lib/hooks/useItemPost";

export function BankAccountPostForm({
                                        getField,
                                        setField,
                                    }: {
    getField: ItemPostFieldGetter<BankAccountPost>,
    setField: ItemPostFieldSetter<BankAccountPost>,
}) {
    return <>
        <ItemTextInput<BankAccountPost, "name">
            field="name"
            getField={getField}
            setField={setField}
            label="Name"
            description={"Bank account name"}
            placeholder="Name"
            required
        />
        <ItemTextInput<BankAccountPost, "description">
            field="description"
            getField={getField}
            setField={setField}
            label="Description"
            description={"Bank account description"}
            placeholder="Description"
        />
        <LedgerAccountSelector<BankAccountPost, "asset_account_id">
            field="asset_account_id"
            getField={getField}
            setField={setField}
            label="Asset account"
            description={"Bank account asset ledger account"}
            placeholder="Asset account"
        />
        <LedgerAccountSelector<BankAccountPost, "interest_income_account_id">
            field="interest_income_account_id"
            getField={getField}
            setField={setField}
            label="Interest income account"
            description={"Bank account interest income ledger account"}
            placeholder="Interest income account"
        />
        <LedgerAccountSelector<BankAccountPost, "interest_receivable_account_id">
            field="interest_receivable_account_id"
            getField={getField}
            setField={setField}
            label="Interest receivable account"
            description={"Bank account interest receivable ledger account"}
            placeholder="Interest receivable account"
        />
        <LedgerAccountSelector<BankAccountPost, "fee_expenses_account_id">
            field="fee_expenses_account_id"
            getField={getField}
            setField={setField}
            label="Fee expenses account"
            description={"Bank account fee expenses ledger account"}
            placeholder="Fee expenses account"
        />
        <LedgerAccountSelector<BankAccountPost, "fees_payable_account_id">
            field="fees_payable_account_id"
            getField={getField}
            setField={setField}
            label="Fees payable account"
            description={"Bank account fees payable ledger account"}
            placeholder="Fees payable account"
        />
    </>
}