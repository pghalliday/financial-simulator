import {AddItemModal} from "~/components/modals/AddItemModal";
import {ConfirmDeleteModal} from "~/components/modals/ConfirmDeleteModal";
import {
    BANK_ACCOUNT_HREF,
    BANK_ACCOUNTS_ADD_ITEM_MODAL_TITLE,
    BANK_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    BANK_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_TITLE
} from "~/strings";
import {type Column, ItemList, type SearchKeys, type SortBy} from "~/components/controls/item_list/ItemList";
import {useDisclosure} from "@mantine/hooks";
import {useCallback, useEffect, useState} from "react";
import {
    type BankAccountGet,
    type BankAccountPost,
    deleteItemRouteBankAccountsItemIdDelete,
    postItemRouteBankAccountsPost
} from "~/client";
import {useItemPost} from "~/lib/hooks/useItemPost";
import {validateBankAccountPost} from "~/lib/validators";
import {usePostItem} from "~/lib/hooks/usePostItem";
import {useDeleteItem} from "~/lib/hooks/useDeleteItem";
import {BankAccountPostForm} from "~/components/forms/BankAccountPostForm";
import {getBankAccountPageParams} from "~/routes/BankAccount";

const NAME_COLUMN: Column<BankAccountGet> = {
    field: "name",
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.localeCompare(b),
}

const DESCRIPTION_COLUMN: Column<BankAccountGet> = {
    field: "description",
    heading: "Description",
    hasLink: false,
    compare: (a, b) => a.localeCompare(b),
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

export function BankAccountList({
                                    items
                                }: {
    items: BankAccountGet[]
}) {
    const [internalItems, setInternalItems] = useState<BankAccountGet[]>([])
    useEffect(() => {
        setInternalItems(items)
    }, [items]);

    const [addItemModalOpened, {open: openAddItemModal, close: closeAddItemModal}] = useDisclosure()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState("")
    const [confirmDeleteItemModalOpened, {
        open: openConfirmDeleteItemModal,
        close: closeConfirmDeleteItemModal
    }] = useDisclosure()
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()
    const postItem = usePostItem<BankAccountPost, BankAccountGet>(
        internalItems,
        setInternalItems,
        postItemRouteBankAccountsPost,
        startAddingItem,
        stopAddingItem,
        closeAddItemModal
    )
    const {setToDelete, deleteItem} = useDeleteItem(
        internalItems,
        setInternalItems,
        deleteItemRouteBankAccountsItemIdDelete,
        startDeletingItem,
        stopDeletingItem,
        closeConfirmDeleteItemModal
    )
    const {setItemPost, getField, setField, valid, submit} = useItemPost(
        validateBankAccountPost,
        postItem,
    )

    const startAddItem = useCallback(() => {
        setItemPost({
            name: "",
            description: "",
        })
        openAddItemModal()
    }, [internalItems])

    const startDeleteItem = useCallback((item: BankAccountGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(BANK_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_PROMPT(item.name))
        openConfirmDeleteItemModal()
    }, [internalItems])

    return <>
        <AddItemModal
            opened={addItemModalOpened}
            working={addingItem}
            title={BANK_ACCOUNTS_ADD_ITEM_MODAL_TITLE}
            onSubmit={submit}
            submitDisabled={!valid}
            onCancel={closeAddItemModal}
        >
            <BankAccountPostForm getField={getField} setField={setField}/>
        </AddItemModal>
        <ConfirmDeleteModal
            opened={confirmDeleteItemModalOpened}
            working={deletingItem}
            title={BANK_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_TITLE}
            prompt={confirmDeletePrompt}
            onConfirm={deleteItem}
            onCancel={closeConfirmDeleteItemModal}
        />
        <ItemList
            columns={COLUMNS}
            items={internalItems}
            getItemPageParams={getBankAccountPageParams}
            href={BANK_ACCOUNT_HREF}
            onAdd={startAddItem}
            onDelete={startDeleteItem}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}