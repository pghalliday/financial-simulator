import {useLedgerAccountPostFormContext,} from "~/forms/ledger_account/contexts";
import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {LedgerAccountPostForm} from "~/forms/ledger_account/LedgerAccountPostForm";
import {type LedgerAccountPost} from "../../../../client";
import {LEDGER_ACCOUNT_PARAMS} from "~/page_params/ledger_accounts";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: LedgerAccountPost) => void
    onCancel: () => void
    working: boolean
}

export function AddLedgerAccountModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working,
    }: Props
) {
    const form = useLedgerAccountPostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={LEDGER_ACCOUNT_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <LedgerAccountPostForm/>
    </AddItemModal>
}