import {useHeaderData} from "~/components/HeaderDataProvider";
import {type Item, ItemList, type ToDeleteData} from "~/components/ItemList";
import {AddItemModal, type ToAddData} from "~/components/AddItemModal";
import {ConfirmDeleteModal} from "~/components/ConfirmDeleteModal";
import {useCallback, useEffect, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {Box, LoadingOverlay} from "@mantine/core";
import type {APIItem, APIItems} from "~/lib/api";

interface ListPageProps {
    collectionTitle: string
    collectionDescription: string
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
                                   itemHref,
                                   breadcrumbs,
                                   itemTypes,
                                   getItems,
                                   postItem,
                                   deleteItem,
                               }: ListPageProps) {
    const [_, setHeaderData] = useHeaderData();
    const [items, setItems] = useState<Item[]>([])
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
                console.error(`${response.status}: ${response.statusText}: ${error}`)
            }
        }).finally(stopLoading)
    }, []);

    const addEntity = useCallback((toAddData: ToAddData) => {
        startAddItemWorking()
        postItem(toAddData).then(({data, error, response}) => {
            if (data != undefined) {
                setItems(items.concat([data]))
                closeAddItem()
            } else {
                console.error(`${response.status}: ${response.statusText}: ${error}`)
            }
        }).finally(stopAddItemWorking)
    }, [items]);

    const deleteEntity = useCallback((entityId: string) => {
        startConfirmDeleteWorking()
        deleteItem(entityId).then(({data, error, response}) => {
            if (data != undefined) {
                setItems(items.filter(entity => entity.id !== data.id))
                closeConfirmDelete()
            } else {
                console.error(`${response.status}: ${response.statusText}: ${error}`)
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
            onSubmit={addEntity}
            collectionLabel="entity"
            typeSelectData={typeSelectData}
        />
        <ConfirmDeleteModal
            opened={confirmDeleteOpened}
            working={confirmDeleteWorking}
            onCancel={closeConfirmDelete}
            onConfirm={() => {
                deleteEntity(toDeleteData.id);
            }}
            collectionLabel="entity"
            itemName={toDeleteData.name}
        />
        <ItemList
            items={items}
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
