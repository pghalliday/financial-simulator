import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {BANK_ACCOUNTS_ADD_ITEM_MODAL_TITLE} from "~/strings";
import type {BankAccountPost, LedgerAccountGet, LedgerAccountPost} from "../../../client";
import {BANK_ACCOUNT_POST_FORM_NAME} from "~/forms/bank_account/BankAccountPostFormContext";
import {BankAccountPostForm} from "~/forms/bank_account/BankAccountPostForm";
import type {TreeData} from "~/lib/TreeData";

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
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        formName={BANK_ACCOUNT_POST_FORM_NAME}
        working={working}
        title={BANK_ACCOUNTS_ADD_ITEM_MODAL_TITLE}
        onSubmit={onSubmit}
        onCancel={onCancel}
    >
        <BankAccountPostForm ledgerAccountTree={ledgerAccountTree} onAddLedgerAccount={onAddLedgerAccount}/>
    </AddItemModal>
}