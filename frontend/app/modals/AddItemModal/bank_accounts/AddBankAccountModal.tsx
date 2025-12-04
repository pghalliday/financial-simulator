import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import type {BankAccountPost, LedgerAccountGet, LedgerAccountPost} from "../../../../client";
import {BankAccountPostForm} from "~/forms/bank_account/BankAccountPostForm";
import type {TreeData} from "~/lib/TreeData";
import {useBankAccountPostFormContext} from "~/forms/bank_account/contexts";
import {BANK_ACCOUNT_PARAMS} from "~/page_params/bank_accounts";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: BankAccountPost) => void
    onCancel: () => void
    working: boolean
    ledgerAccountTree: TreeData<LedgerAccountGet>
    onAddLedgerAccount: (initialValues: LedgerAccountPost) => void
}

export function AddBankAccountModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working,
        ledgerAccountTree,
        onAddLedgerAccount,
    }: Props
) {
    const form = useBankAccountPostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={BANK_ACCOUNT_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <BankAccountPostForm
            ledgerAccountTree={ledgerAccountTree}
            onAddLedgerAccount={onAddLedgerAccount}
        />
    </AddItemModal>
}