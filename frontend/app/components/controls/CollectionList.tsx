import {AddItemModal} from "~/components/modals/AddItemModal";
import {ConfirmDeleteModal} from "~/components/modals/ConfirmDeleteModal";
import {type Column, ItemList, type SearchKeys, type SortBy} from "~/components/controls/item_list/ItemList";
import {useDisclosure} from "@mantine/hooks";
import {type PropsWithChildren, useCallback, useEffect, useState} from "react";
import {type ItemPostValidator, useItemPost} from "~/lib/hooks/useItemPost";
import {usePostItem} from "~/lib/hooks/usePostItem";
import {useDeleteItem} from "~/lib/hooks/useDeleteItem";
import type {DeleteItemApi, IdItem, PostItemApi} from "~/lib/types";
import type {ItemPageParams} from "~/lib/hooks/useItemPageParams";
import {GetSetProvider} from "~/components/providers/GetSetProvider";

export interface CollectionListProps<Get extends IdItem, Post extends {}> {
    columns: Column<Get>[]
    searchFields: SearchKeys<Get>[],
    defaultSortBy: SortBy<Get>[],
    getItemPageParams: (item: Get) => ItemPageParams,
    itemHref: (itemPageParams: ItemPageParams) => string,
    items: Get[],
    onPost: PostItemApi<Post, Get>,
    onDelete: DeleteItemApi<Get>,
    onValidate: ItemPostValidator<Post>
    addItemModalTitle: string,
    addItemModalDefaultPost: Partial<Post>,
    confirmDeleteItemModalTitle: string,
    confirmDeleteItemModalPrompt: (item: Get) => string,
}

export function CollectionList<Get extends IdItem, Post extends {}>({
                                                                        columns,
                                                                        searchFields,
                                                                        defaultSortBy,
                                                                        getItemPageParams,
                                                                        itemHref,
                                                                        items,
                                                                        onPost,
                                                                        onDelete,
                                                                        onValidate,
                                                                        addItemModalTitle,
                                                                        addItemModalDefaultPost,
                                                                        confirmDeleteItemModalTitle,
                                                                        confirmDeleteItemModalPrompt,
                                                                        children,
                                                                    }: PropsWithChildren<CollectionListProps<Get, Post>>) {
    const [internalItems, setInternalItems] = useState<Get[]>([])
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
    const postItem = usePostItem<Post, Get>(
        internalItems,
        setInternalItems,
        onPost,
        startAddingItem,
        stopAddingItem,
        closeAddItemModal
    )
    const {setToDelete, deleteItem} = useDeleteItem(
        internalItems,
        setInternalItems,
        onDelete,
        startDeletingItem,
        stopDeletingItem,
        closeConfirmDeleteItemModal
    )
    const {setItemPost, getField, setField, valid, submit} = useItemPost(
        onValidate,
        postItem,
    )

    const startAddItem = useCallback(() => {
        setItemPost(addItemModalDefaultPost)
        openAddItemModal()
    }, [internalItems])

    const startDeleteItem = useCallback((item: Get) => {
        setToDelete(item)
        setConfirmDeletePrompt(confirmDeleteItemModalPrompt(item))
        openConfirmDeleteItemModal()
    }, [internalItems])

    return <>
        <AddItemModal
            opened={addItemModalOpened}
            working={addingItem}
            title={addItemModalTitle}
            onSubmit={submit}
            submitDisabled={!valid}
            onCancel={closeAddItemModal}
        >
            <GetSetProvider getField={getField} setField={setField}>
                {children}
            </GetSetProvider>
        </AddItemModal>
        <ConfirmDeleteModal
            opened={confirmDeleteItemModalOpened}
            working={deletingItem}
            title={confirmDeleteItemModalTitle}
            prompt={confirmDeletePrompt}
            onConfirm={deleteItem}
            onCancel={closeConfirmDeleteItemModal}
        />
        <ItemList
            columns={columns}
            items={internalItems}
            getItemPageParams={getItemPageParams}
            href={itemHref}
            onAdd={startAddItem}
            onDelete={startDeleteItem}
            searchFields={searchFields}
            defaultSortBy={defaultSortBy}
        />
    </>
}