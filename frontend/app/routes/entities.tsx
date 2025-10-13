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
import {getItemsEntitiesGet} from "~/client";
import {ApiError} from "~/ApiError";
import {ItemList, type ToDeleteData} from "~/components/ItemList";
import {AddItemModal} from "~/components/AddItemModal";
import {useDisclosure} from "@mantine/hooks";
import {ConfirmDeleteModal} from "~/components/ConfirmDeleteModal";

export async function clientLoader() {
    const response = await getItemsEntitiesGet()
    if (response.data !== undefined) {
        return response.data
    }
    throw new ApiError(response.response.status, response.response.statusText, response.error)
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

    return <>
        <title>{title}</title>
        <meta property="og:title" content={title}/>
        <meta property="description" content={description}/>
        <AddItemModal
            opened={addItemOpened}
            onCancel={closeAddItem}
            onSubmit={(toAddData) => {
                console.info(toAddData);
                closeAddItem();
            }}
            label="entity"
            types={ENTITY_TYPES}
        />
        <ConfirmDeleteModal
            opened={confirmDeleteOpened}
            onCancel={closeConfirmDelete}
            onConfirm={() => {
                console.info(toDeleteData);
                closeConfirmDelete()
            }}
            label="entity"
            name={toDeleteData.name}
        />
        <ItemList
            items={entities}
            types={ENTITY_TYPES}
            href={ENTITY_HREF}
            onAdd={openAddItem}
            onDelete={(toDeleteData) => {
                setToDeleteData(toDeleteData);
                openConfirmDelete();
            }}
        />
    </>
}
