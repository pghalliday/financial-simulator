import {useEffect, useState} from "react";
import type {Route} from "./+types/scenarios";
import {useHeaderData} from "~/components/HeaderDataProvider";
import {
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_NAME,
    SCENARIO_HREF,
    SCENARIOS_HREF,
    SCENARIOS_NAME,
    TITLE
} from "~/strings";
import {getItemsScenariosGet} from "~/client"
import {ItemList, type ToDeleteData} from "~/components/ItemList";
import {ApiError} from "~/ApiError";
import {useDisclosure} from "@mantine/hooks";
import {AddItemModal} from "~/components/AddItemModal";
import {ConfirmDeleteModal} from "~/components/ConfirmDeleteModal";

export async function clientLoader() {
    const response = await getItemsScenariosGet()
    if (response.data !== undefined) {
        return response.data
    }
    throw new ApiError(response.response.status, response.response.statusText, response.error)
}

export default function Scenarios({loaderData}: Route.ComponentProps) {
    const [_, setHeaderData] = useHeaderData();
    const [scenarios, setScenarios] = useState(loaderData)
    const [addItemOpened, {open: openAddItem, close: closeAddItem}] = useDisclosure()
    const [confirmDeleteOpened, {open: openConfirmDelete, close: closeConfirmDelete}] = useDisclosure()
    const [toDeleteData, setToDeleteData] = useState<ToDeleteData>({
        id: "scenario id",
        name: "scenario name",
    })

    const description = SCENARIOS_NAME
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
                    href: SCENARIOS_HREF,
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
            label="scenario"
        />
        <ConfirmDeleteModal
            opened={confirmDeleteOpened}
            onCancel={closeConfirmDelete}
            onConfirm={() => {
                console.info(toDeleteData);
                closeConfirmDelete();
            }}
            label="scenario"
            name={toDeleteData.name}
        />
        <ItemList
            items={scenarios}
            href={SCENARIO_HREF}
            onAdd={openAddItem}
            onDelete={toDeleteData => {
                setToDeleteData(toDeleteData);
                openConfirmDelete();
            }}
        />
    </>
}
