import {AddItemModal} from "~/components/modals/AddItemModal";
import {LedgerAccountPostForm} from "~/components/forms/LedgerAccountPostForm";
import {ConfirmDeleteModal} from "~/components/modals/ConfirmDeleteModal";
import {
    LEDGER_ACCOUNT_HREF,
    LEDGER_ACCOUNTS_ADD_ITEM_MODAL_TITLE,
    LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_TITLE
} from "~/strings";
import {type Column, ItemList, type SearchKeys, type SortBy} from "~/components/controls/item_list/ItemList";
import {useDisclosure} from "@mantine/hooks";
import {useCallback, useEffect, useState} from "react";
import {
    deleteItemRouteLedgerAccountsItemIdDelete,
    type LedgerAccountGet,
    type LedgerAccountPost,
    postItemRouteLedgerAccountsPost
} from "~/client";
import {useItemPost} from "~/lib/hooks/useItemPost";
import {validateLedgerAccountPost} from "~/lib/validators";
import {usePostItem} from "~/lib/hooks/usePostItem";
import {useDeleteItem} from "~/lib/hooks/useDeleteItem";
import {getLedgerAccountPageParams} from "~/routes/LedgerAccount";

const ACCOUNT_NAME_COLUMN: Column<LedgerAccountGet> = {
    field: "account_name",
    heading: "Account name",
    hasLink: true,
    compare: (a, b) => a.localeCompare(b),
}

const NAME_COLUMN: Column<LedgerAccountGet> = {
    field: "name",
    heading: "Name",
    hasLink: false,
    compare: (a, b) => a.localeCompare(b),
}

const DESCRIPTION_COLUMN: Column<LedgerAccountGet> = {
    field: "description",
    heading: "Description",
    hasLink: false,
    compare: (a, b) => a.localeCompare(b),
}

const COLUMNS = [ACCOUNT_NAME_COLUMN, NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<LedgerAccountGet>[] = [{
    column: ACCOUNT_NAME_COLUMN,
    reversed: false,
}, {
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<LedgerAccountGet>[] = ["account_name", "name", "description"]

export function LedgerAccountList({
                                      parent,
                                      items
                                  }: {
    parent?: LedgerAccountGet,
    items: LedgerAccountGet[]
}) {
    const [internalItems, setInternalItems] = useState<LedgerAccountGet[]>([])
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
    const postItem = usePostItem<LedgerAccountPost, LedgerAccountGet>(
        internalItems,
        setInternalItems,
        postItemRouteLedgerAccountsPost,
        startAddingItem,
        stopAddingItem,
        closeAddItemModal
    )
    const {setToDelete, deleteItem} = useDeleteItem(
        internalItems,
        setInternalItems,
        deleteItemRouteLedgerAccountsItemIdDelete,
        startDeletingItem,
        stopDeletingItem,
        closeConfirmDeleteItemModal
    )
    const {setItemPost, getField, setField, valid, submit} = useItemPost(
        validateLedgerAccountPost,
        postItem,
    )

    const startAddItem = useCallback(() => {
        setItemPost({
            parent_id: parent?.id,
            name: "",
            account_name: "",
            description: "",
        })
        openAddItemModal()
    }, [internalItems])

    const startDeleteItem = useCallback((item: LedgerAccountGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_PROMPT(item.name))
        openConfirmDeleteItemModal()
    }, [internalItems])

    return <>
        <AddItemModal
            opened={addItemModalOpened}
            working={addingItem}
            title={LEDGER_ACCOUNTS_ADD_ITEM_MODAL_TITLE}
            onSubmit={submit}
            submitDisabled={!valid}
            onCancel={closeAddItemModal}
        >
            <LedgerAccountPostForm parent={parent} getField={getField} setField={setField}/>
        </AddItemModal>
        <ConfirmDeleteModal
            opened={confirmDeleteItemModalOpened}
            working={deletingItem}
            title={LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_TITLE}
            prompt={confirmDeletePrompt}
            onConfirm={deleteItem}
            onCancel={closeConfirmDeleteItemModal}
        />
        <ItemList
            columns={COLUMNS}
            items={internalItems}
            getItemPageParams={getLedgerAccountPageParams}
            href={LEDGER_ACCOUNT_HREF}
            onAdd={startAddItem}
            onDelete={startDeleteItem}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}