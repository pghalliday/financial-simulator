import {useEffect, useState} from "react";
import type {Route} from "./+types/entities";
import {useHeaderData} from "~/components/HeaderDataProvider";
import {
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_NAME,
    ENTITIES_HREF,
    ENTITIES_NAME,
    ENTITY_HREF,
    ENTITY_TYPES,
    TITLE
} from "~/strings";
import type {CorporationEntityPost, IndividualEntityPost} from "~/client";
import {deleteItemEntitiesItemIdDelete, getItemsEntitiesGet, postItemEntitiesPost} from "~/client";
import {ApiError} from "~/ApiError";
import {ItemList, type ToDeleteData} from "~/components/ItemList";
import {AddItemModal, type ToAddData} from "~/components/AddItemModal";
import {useDisclosure} from "@mantine/hooks";
import {ConfirmDeleteModal} from "~/components/ConfirmDeleteModal";

const TYPE_SELECT_DATA = Object.entries(ENTITY_TYPES).map(entry => ({
    value: entry[0],
    label: entry[1],
}))

const INITIAL_TO_ADD_DATA: ToAddData = {
    name: "",
    description: "",
    type: TYPE_SELECT_DATA[0].value
}

export async function clientLoader() {
    const {data, error, response} = await getItemsEntitiesGet()
    if (data !== undefined) {
        return data
    }
    throw new ApiError(response.status, response.statusText, error)
}

export default function Entities({loaderData}: Route.ComponentProps) {
    const [_, setHeaderData] = useHeaderData();
    const [entities, setEntities] = useState(loaderData)
    const [addItemOpened, {open: openAddItem, close: closeAddItem}] = useDisclosure()
    const [confirmDeleteOpened, {open: openConfirmDelete, close: closeConfirmDelete}] = useDisclosure()
    const [toDeleteData, setToDeleteData] = useState<ToDeleteData>({
        id: "entity id",
        name: "entity name",
    })
    const [confirmDeleteData, setConfirmDeleteData] = useState<string>()
    const [toAddData, setToAddData] = useState<ToAddData>()

    const description = ENTITIES_NAME
    const title = TITLE(description)

    useEffect(() => {
        setHeaderData({
            title: title,
            breadcrumbs: [
                {
                    title: COMPARE_SCENARIOS_NAME,
                    href: COMPARE_SCENARIOS_HREF,
                },
                {
                    title: description,
                    href: ENTITIES_HREF,
                },
            ],
        });
    }, []);

    useEffect(() => {
        if (toAddData !== undefined) {
            postItemEntitiesPost({
                // TODO: can we properly type toAddData?
                body: toAddData as (IndividualEntityPost | CorporationEntityPost),
            }).then(({data, error, response}) => {
                if (data != undefined) {
                    setEntities(entities.concat([data]))
                    closeAddItem()
                } else {
                    console.error(`${response.status}: ${response.statusText}: ${error}`)
                }
            })
        }
    }, [toAddData])

    useEffect(() => {
        if (confirmDeleteData != undefined) {
            deleteItemEntitiesItemIdDelete({
                path: {
                    item_id: confirmDeleteData
                }
            }).then(({data, error, response}) => {
                if (data != undefined) {
                    setEntities(entities.filter(entity => entity.id !== data.id))
                    closeConfirmDelete()
                } else {
                    console.error(`${response.status}: ${response.statusText}: ${error}`)
                }
            })
        }
    }, [confirmDeleteData])

    return <>
        <title>{title}</title>
        <meta property="og:title" content={title}/>
        <meta property="description" content={description}/>
        <AddItemModal
            opened={addItemOpened}
            initialData={INITIAL_TO_ADD_DATA}
            onCancel={closeAddItem}
            onSubmit={setToAddData}
            collectionLabel="entity"
            typeSelectData={TYPE_SELECT_DATA}
        />
        <ConfirmDeleteModal
            opened={confirmDeleteOpened}
            onCancel={closeConfirmDelete}
            onConfirm={() => {
                setConfirmDeleteData(toDeleteData.id);
            }}
            collectionLabel="entity"
            itemName={toDeleteData.name}
        />
        <ItemList
            items={entities}
            itemTypes={ENTITY_TYPES}
            href={ENTITY_HREF}
            onAdd={openAddItem}
            onDelete={(toDeleteData) => {
                setToDeleteData(toDeleteData);
                openConfirmDelete();
            }}
        />
    </>
}
