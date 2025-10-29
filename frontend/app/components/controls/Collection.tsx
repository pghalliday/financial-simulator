import {AddItemModal} from "~/components/modals/AddItemModal";
import {ConfirmDeleteModal} from "~/components/modals/ConfirmDeleteModal";
import {useDisclosure} from "@mantine/hooks";
import {type PropsWithChildren, type Ref, useCallback, useImperativeHandle, useState} from "react";
import {type ItemPostValidator, useItemPost} from "~/lib/hooks/useItemPost";
import {usePostItem} from "~/lib/hooks/usePostItem";
import {useDeleteItem} from "~/lib/hooks/useDeleteItem";
import type {DeleteItemApi, IdItem, PostItemApi} from "~/lib/types";
import {GetSetProvider} from "~/components/providers/GetSetProvider";

export interface CollectionRef<Get extends IdItem, Post extends {}> {
    startAddItem: (initialValues: Partial<Post>) => void
    startDeleteItem: (item: Get) => void
}

export interface CollectionProps<Get extends IdItem, Post extends {}> {
    ref?: Ref<CollectionRef<Get, Post>>,
    items: Get[],
    setItems: (items: Get[]) => void,
    onPost: PostItemApi<Post, Get>,
    onDelete: DeleteItemApi<Get>,
    onValidate: ItemPostValidator<Post>
    addItemModalTitle: string,
    confirmDeleteItemModalTitle: string,
    confirmDeleteItemModalPrompt: (item: Get) => string,
}

export function Collection<Get extends IdItem, Post extends {}>({
                                                                    ref,
                                                                    items,
                                                                    setItems,
                                                                    onPost,
                                                                    onDelete,
                                                                    onValidate,
                                                                    addItemModalTitle,
                                                                    confirmDeleteItemModalTitle,
                                                                    confirmDeleteItemModalPrompt,
                                                                    children,
                                                                }: PropsWithChildren<CollectionProps<Get, Post>>) {
    const [addItemModalOpened, {open: openAddItemModal, close: closeAddItemModal}] = useDisclosure()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState("")
    const [confirmDeleteItemModalOpened, {
        open: openConfirmDeleteItemModal,
        close: closeConfirmDeleteItemModal
    }] = useDisclosure()
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()
    const postItem = usePostItem<Post, Get>(
        items,
        setItems,
        onPost,
        startAddingItem,
        stopAddingItem,
        closeAddItemModal
    )
    const {setToDelete, deleteItem} = useDeleteItem(
        items,
        setItems,
        onDelete,
        startDeletingItem,
        stopDeletingItem,
        closeConfirmDeleteItemModal
    )
    const {setItemPost, getField, setField, valid, submit} = useItemPost(
        onValidate,
        postItem,
    )

    const startAddItem = useCallback((initialValues: Partial<Post>) => {
        setItemPost(initialValues)
        openAddItemModal()
    }, [setItemPost])

    const startDeleteItem = useCallback((item: Get) => {
        setToDelete(item)
        setConfirmDeletePrompt(confirmDeleteItemModalPrompt(item))
        openConfirmDeleteItemModal()
    }, [setToDelete])

    useImperativeHandle(ref, () => ({
        startAddItem,
        startDeleteItem,
    }), [startAddItem, startDeleteItem])

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
    </>
}