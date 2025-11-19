import {
    BANK_ACCOUNT_HREF,
    BANK_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    BANK_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_TITLE
} from "~/strings";
import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {
    type BankAccountGet,
    type BankAccountPost,
    deleteItemRouteBankAccountsItemIdDelete,
    type LedgerAccountGet,
    type LedgerAccountPost,
    postItemRouteBankAccountsPost,
    postItemRouteLedgerAccountsPost
} from "../../client";
import {getBankAccountPageParams} from "~/routes/BankAccount";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/lib/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {AddBankAccountModal} from "~/modals/AddItemModal/AddBankAccountModal";
import {AddLedgerAccountModal} from "~/modals/AddItemModal/AddLedgerAccountModal";
import {useTreePost} from "~/lib/hooks/useTreePost";
import {useListDelete} from "~/lib/hooks/useListDelete";
import type {TreeData} from "~/lib/TreeData";
import {Modal, useModalsStack} from "@mantine/core";
import {useBankAccountPostFormContext} from "~/forms/bank_account/BankAccountPostFormContext";
import {useLedgerAccountPostFormContext} from "~/forms/ledger_account/LedgerAccountPostFormContext";

const NAME_COLUMN: Column<BankAccountGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const DESCRIPTION_COLUMN: Column<BankAccountGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<BankAccountGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<BankAccountGet>[] = ["name", "description"]

interface Props {
    bankAccounts: BankAccountGet[]
    onBankAccountsChange?: (items: BankAccountGet[]) => void
    ledgerAccountTree: TreeData<LedgerAccountGet>
    onLedgerAccountTreeChange?: (tree: TreeData<LedgerAccountGet>) => void
}

export function BankAccountList(
    {
        bankAccounts,
        onBankAccountsChange = () => {
        },
        ledgerAccountTree,
        onLedgerAccountTreeChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-bank-account", "add-ledger-account", "confirm-delete"])
    const bankAccountPostForm = useBankAccountPostFormContext()
    const ledgerAccountPostForm = useLedgerAccountPostFormContext()
    const [addingBankAccount, {open: startAddingBankAccount, close: stopAddingBankAccount}] = useDisclosure()
    const [addingLedgerAccount, {open: startAddingLedgerAccount, close: stopAddingLedgerAccount}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const postBankAccount = useListPost<BankAccountPost, BankAccountGet>({
        items: bankAccounts,
        onPostSuccess: (items) => {
            stack.close("add-bank-account")
            onBankAccountsChange(items)
        },
        onPost: postItemRouteBankAccountsPost,
        onBeginPost: startAddingBankAccount,
        onEndPost: stopAddingBankAccount,
    })

    const {setToDelete, deleteItem} = useListDelete<BankAccountPost, BankAccountGet>({
        items: bankAccounts,
        onDeleteSuccess: (items) => {
            stack.close("confirm-delete")
            onBankAccountsChange(items)
        },
        onDelete: deleteItemRouteBankAccountsItemIdDelete,
        onBeginDelete: startDeletingItem,
        onEndDelete: stopDeletingItem,
    })

    const onAdd = useCallback(() => {
        const initialValues: BankAccountPost = {
            name: "",
            description: "",
        }
        bankAccountPostForm.setInitialValues(initialValues)
        bankAccountPostForm.reset()
        stack.open("add-bank-account")
    }, [])

    const onDelete = useCallback((item: BankAccountGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(BANK_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_PROMPT(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    const postLedgerAccount = useTreePost<LedgerAccountPost, LedgerAccountGet>({
        treeData: ledgerAccountTree,
        onPostSuccess: (ledgerAccountTree) => {
            stack.close("add-ledger-account")
            onLedgerAccountTreeChange(ledgerAccountTree)
        },
        onPost: postItemRouteLedgerAccountsPost,
        onBeginPost: startAddingLedgerAccount,
        onEndPost: stopAddingLedgerAccount,
    })

    return <>
        <Modal.Stack>
            <AddBankAccountModal
                {...stack.register("add-bank-account")}
                working={addingBankAccount}
                onSubmit={postBankAccount}
                onCancel={() => stack.close("add-bank-account")}
                ledgerAccountTree={ledgerAccountTree}
                onAddLedgerAccount={(initialValues) => {
                    ledgerAccountPostForm.setInitialValues(initialValues)
                    ledgerAccountPostForm.reset()
                    stack.open("add-ledger-account")
                }}
            />
            <AddLedgerAccountModal
                {...stack.register("add-ledger-account")}
                working={addingLedgerAccount}
                onSubmit={postLedgerAccount}
                onCancel={() => stack.close("add-ledger-account")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={BANK_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_TITLE}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={bankAccounts}
            getItemPageParams={getBankAccountPageParams}
            href={BANK_ACCOUNT_HREF}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}