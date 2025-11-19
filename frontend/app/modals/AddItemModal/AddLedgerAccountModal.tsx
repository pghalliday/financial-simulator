import {LEDGER_ACCOUNT_POST_FORM_NAME,} from "~/forms/ledger_account/LedgerAccountPostFormContext";
import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {LEDGER_ACCOUNTS_ADD_ITEM_MODAL_TITLE} from "~/strings";
import {LedgerAccountPostForm} from "~/forms/ledger_account/LedgerAccountPostForm";
import {type LedgerAccountPost} from "../../../client";

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
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        formName={LEDGER_ACCOUNT_POST_FORM_NAME}
        working={working}
        title={LEDGER_ACCOUNTS_ADD_ITEM_MODAL_TITLE}
        onSubmit={onSubmit}
        onCancel={onCancel}
    >
        <LedgerAccountPostForm/>
    </AddItemModal>
}