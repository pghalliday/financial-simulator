import {useHeaderData} from "~/components/providers/HeaderDataProvider";
import {ItemList, type RowData, type ToDeleteData} from "~/components/controls/item_list/ItemList";
import {AddItemModal, type ToAddData} from "~/components/modals/AddItemModal";
import {ConfirmDeleteModal} from "~/components/modals/ConfirmDeleteModal";
import {useCallback, useEffect, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {Box, LoadingOverlay} from "@mantine/core";
import type {APIItem, APIItems} from "~/lib/api_results";
import {notifyError} from "~/lib/errors";

interface ListPageProps {
    collectionTitle: string
    collectionDescription: string
    collectionLabel: string
    itemHref: (itemId: string) => string
    breadcrumbs: { title: string, href: string }[]
    itemTypes?: Record<string, string>
    getItems: () => Promise<APIItems>
    postItem: (toAddData: ToAddData) => Promise<APIItem>
    deleteItem: (itemId: string) => Promise<APIItem>
}

export function CollectionPage({
                                   collectionTitle,
                                   collectionDescription,
                                   collectionLabel,
                                   itemHref,
                                   breadcrumbs,
                                   itemTypes,
                                   getItems,
                                   postItem,
                                   deleteItem,
                               }: ListPageProps) {
    const [_, setHeaderData] = useHeaderData();
    const [items, setItems] = useState<RowData[]>([])
    const [addItemOpened, {open: openAddItem, close: closeAddItem}] = useDisclosure()
    const [confirmDeleteOpened, {open: openConfirmDelete, close: closeConfirmDelete}] = useDisclosure()
    const [toDeleteData, setToDeleteData] = useState<ToDeleteData>({
        id: "id",
        name: "name",
    })
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [addItemWorking, {open: startAddItemWorking, close: stopAddItemWorking}] = useDisclosure()
    const [confirmDeleteWorking, {open: startConfirmDeleteWorking, close: stopConfirmDeleteWorking}] = useDisclosure()

    const typeSelectData = itemTypes === undefined ? undefined : Object.entries(itemTypes)
        .map(entry => ({
            value: entry[0],
            label: entry[1],
        }))

    const initialToAddData: ToAddData = {
        name: "",
        description: "",
        type: typeSelectData === undefined ? null : typeSelectData[0].value
    }


    useEffect(() => {
        setHeaderData({
            title: collectionTitle,
            breadcrumbs: breadcrumbs,
        })
        startLoading()
        getItems().then(({data, error, response}) => {
            if (data != undefined) {
                setItems(data)
            } else {
                notifyError('Get items error', response, error)
            }
        }).finally(stopLoading)
    }, []);

    const addItem = useCallback((toAddData: ToAddData) => {
        startAddItemWorking()
        postItem(toAddData).then(({data, error, response}) => {
            if (data != undefined) {
                setItems(items.concat([data]))
                closeAddItem()
            } else {
                notifyError('Add item error', response, error)
            }
        }).finally(stopAddItemWorking)
    }, [items]);

    const removeItem = useCallback((itemId: string) => {
        startConfirmDeleteWorking()
        deleteItem(itemId).then(({data, error, response}) => {
            if (data != undefined) {
                setItems(items.filter(item => item.id !== data.id))
                closeConfirmDelete()
            } else {
                notifyError('Delete item error', response, error)
            }
        }).finally(stopConfirmDeleteWorking)
    }, [items]);

    return <Box pos="relative">
        <title>{collectionTitle}</title>
        <meta property="og:title" content={collectionTitle}/>
        <meta property="description" content={collectionDescription}/>
        <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{blur: 2}}
        />
        <AddItemModal
            opened={addItemOpened}
            working={addItemWorking}
            initialData={initialToAddData}
            onCancel={closeAddItem}
            onSubmit={addItem}
            collectionLabel={collectionLabel}
            typeSelectData={typeSelectData}
        />
        <ConfirmDeleteModal
            opened={confirmDeleteOpened}
            working={confirmDeleteWorking}
            onCancel={closeConfirmDelete}
            onConfirm={() => {
                removeItem(toDeleteData.id);
            }}
            collectionLabel={collectionLabel}
            itemName={toDeleteData.name}
        />
        <ItemList
            data={items}
            itemTypes={itemTypes}
            href={itemHref}
            onAdd={openAddItem}
            onDelete={(toDeleteData) => {
                setToDeleteData(toDeleteData);
                openConfirmDelete();
            }}
        />
    </Box>
}
