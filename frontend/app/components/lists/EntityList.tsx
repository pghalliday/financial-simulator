import {AddItemModal} from "~/components/modals/AddItemModal/AddItemModal";
import {ConfirmDeleteModal} from "~/components/modals/ConfirmDeleteModal";
import {
    ENTITIES_ADD_ITEM_MODAL_TITLE,
    ENTITIES_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    ENTITIES_CONFIRM_DELETE_ITEM_MODAL_TITLE,
    ENTITY_HREF,
    ENTITY_TYPES
} from "~/strings";
import {type Column, ItemList, type SearchKeys, type SortBy} from "~/components/controls/item_list/ItemList";
import {useDisclosure} from "@mantine/hooks";
import {useCallback, useEffect, useState} from "react";
import {deleteItemRouteEntitiesItemIdDelete, postItemRouteEntitiesPost} from "~/client";
import {useItemPost} from "~/lib/hooks/useItemPost";
import {validateEntityPost} from "~/lib/validators";
import {usePostItem} from "~/lib/hooks/usePostItem";
import {useDeleteItem} from "~/lib/hooks/useDeleteItem";
import type {EntityGet, EntityPost} from "~/lib/types";
import {EntityPostForm} from "~/components/forms/EntityPostForm";
import {getEntityPageParams} from "~/routes/Entity";

const NAME_COLUMN: Column<EntityGet> = {
    field: "name",
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.localeCompare(b),
}

const TYPE_COLUMN: Column<EntityGet> = {
    field: "type",
    heading: "Type",
    hasLink: false,
    compare: (a, b) => a.localeCompare(b),
    render: (value) => ENTITY_TYPES[value],
}

const DESCRIPTION_COLUMN: Column<EntityGet> = {
    field: "description",
    heading: "Description",
    hasLink: false,
    compare: (a, b) => a.localeCompare(b),
}

const COLUMNS = [NAME_COLUMN, TYPE_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<EntityGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: TYPE_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<EntityGet>[] = ["name", "description"]

export function EntityList({
                               items
                           }: {
    items: EntityGet[]
}) {
    const [internalItems, setInternalItems] = useState<EntityGet[]>([])
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
    const postItem = usePostItem<EntityPost, EntityGet>(
        internalItems,
        setInternalItems,
        postItemRouteEntitiesPost,
        startAddingItem,
        stopAddingItem,
        closeAddItemModal
    )
    const {setToDelete, deleteItem} = useDeleteItem(
        internalItems,
        setInternalItems,
        deleteItemRouteEntitiesItemIdDelete,
        startDeletingItem,
        stopDeletingItem,
        closeConfirmDeleteItemModal
    )
    const {setItemPost, getField, setField, valid, submit} = useItemPost(
        validateEntityPost,
        postItem,
    )

    const startAddItem = useCallback(() => {
        setItemPost({
            name: "",
            description: "",
        })
        openAddItemModal()
    }, [internalItems])

    const startDeleteItem = useCallback((item: EntityGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(ENTITIES_CONFIRM_DELETE_ITEM_MODAL_PROMPT(item.name))
        openConfirmDeleteItemModal()
    }, [internalItems])

    return <>
        <AddItemModal
            opened={addItemModalOpened}
            working={addingItem}
            title={ENTITIES_ADD_ITEM_MODAL_TITLE}
            onSubmit={submit}
            submitDisabled={!valid}
            onCancel={closeAddItemModal}
        >
            <EntityPostForm allowSelectType getField={getField} setField={setField}/>
        </AddItemModal>
        <ConfirmDeleteModal
            opened={confirmDeleteItemModalOpened}
            working={deletingItem}
            title={ENTITIES_CONFIRM_DELETE_ITEM_MODAL_TITLE}
            prompt={confirmDeletePrompt}
            onConfirm={deleteItem}
            onCancel={closeConfirmDeleteItemModal}
        />
        <ItemList
            columns={COLUMNS}
            items={internalItems}
            getItemPageParams={getEntityPageParams}
            href={ENTITY_HREF}
            onAdd={startAddItem}
            onDelete={startDeleteItem}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}