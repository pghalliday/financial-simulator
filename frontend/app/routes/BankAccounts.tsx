import {
    BANK_ACCOUNT_HREF,
    BANK_ACCOUNTS_HREF,
    BANK_ACCOUNTS_LABEL,
    BANK_ACCOUNTS_PAGE_DESCRIPTION,
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_PAGE_DESCRIPTION,
    PAGE_TITLE
} from "~/strings";
import {
    type BankAccountGet,
    type BankAccountPost,
    deleteItemRouteBankAccountsItemIdDelete,
    getItemsRouteBankAccountsGet,
    postItemRouteBankAccountsPost,
} from "~/client";
import {Page} from "~/components/pages/Page";
import {useDisclosure} from "@mantine/hooks";
import {useItems} from "~/lib/hooks/useItems";
import {type Column, ItemList, type SearchKeys, type SortBy} from "~/components/controls/item_list/ItemList";
import {useCallback, useState} from "react";
import {ConfirmDeleteModal} from "~/components/modals/ConfirmDeleteModal";
import {useItemPost} from "~/lib/hooks/useItemPost";
import {validateBankAccountPost} from "~/lib/validators";
import {AddItemModal} from "~/components/modals/AddItemModal/AddItemModal";
import {BankAccountPostForm} from "~/components/forms/BankAccountPostForm";

const COLLECTION_TITLE = PAGE_TITLE(BANK_ACCOUNTS_PAGE_DESCRIPTION);
const BREADCRUMBS = [
    {
        title: COMPARE_SCENARIOS_PAGE_DESCRIPTION,
        href: COMPARE_SCENARIOS_HREF,
    },
    {
        title: BANK_ACCOUNTS_PAGE_DESCRIPTION,
        href: BANK_ACCOUNTS_HREF,
    },
];

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


export default function BankAccounts() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [addItemModalOpened, {open: openAddItemModal, close: closeAddItemModal}] = useDisclosure()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [toDeleteName, setToDeleteName] = useState<string>()
    const [confirmDeleteItemModalOpened, {
        open: openConfirmDeleteItemModal,
        close: closeConfirmDeleteItemModal
    }] = useDisclosure()
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()
    const {items, postItem, setToDelete, deleteItem} = useItems<BankAccountPost, BankAccountGet>(
        getItemsRouteBankAccountsGet,
        startLoading,
        stopLoading,
        postItemRouteBankAccountsPost,
        startAddingItem,
        stopAddingItem,
        closeAddItemModal,
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
    }, [items])

    const startDeleteItem = useCallback((item: BankAccountGet) => {
        console.log('delete', item)
        setToDelete(item)
        setToDeleteName(item.name)
        openConfirmDeleteItemModal()
    }, [items])

    return <Page
        title={COLLECTION_TITLE}
        description={BANK_ACCOUNTS_PAGE_DESCRIPTION}
        breadcrumbs={BREADCRUMBS}
        loading={loading}
    >
        <AddItemModal
            opened={addItemModalOpened}
            working={addingItem}
            title={"Add Bank Account"}
            onSubmit={submit}
            submitDisabled={!valid}
            onCancel={closeAddItemModal}
        >
            <BankAccountPostForm getField={getField} setField={setField}/>
        </AddItemModal>
        <ConfirmDeleteModal
            opened={confirmDeleteItemModalOpened}
            working={deletingItem}
            onConfirm={deleteItem}
            onCancel={closeConfirmDeleteItemModal}
            collectionLabel={BANK_ACCOUNTS_LABEL}
            itemName={toDeleteName}
        />
        <ItemList
            columns={COLUMNS}
            data={items}
            href={BANK_ACCOUNT_HREF}
            onAdd={startAddItem}
            onDelete={startDeleteItem}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </Page>
}
