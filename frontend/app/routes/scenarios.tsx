import {useEffect, useState} from "react";
import {useLoaderData} from "react-router";
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
import {ItemList} from "~/components/ItemList";
import {ApiError} from "~/ApiError";
import {useDisclosure} from "@mantine/hooks";
import {AddItemModal} from "~/components/AddItemModal";
import {ConfirmDeleteModal} from "~/components/ConfirmDeleteModal";

export async function clientLoader({params}: Route.LoaderArgs) {
    const response = await getItemsScenariosGet()
    if (response.data !== undefined) {
        return response.data
    }
    throw new ApiError(response.response.status, response.response.statusText, response.error)
}

export default function Scenarios({params}: Route.ComponentProps) {
    const [_, setHeaderData] = useHeaderData();
    const scenarios = useLoaderData<typeof clientLoader>()
    const [addItemOpened, {open: openAddItem, close: closeAddItem}] = useDisclosure()
    const [confirmDeleteOpened, {open: openConfirmDelete, close: closeConfirmDelete}] = useDisclosure()
    const [toDelete, setToDelete] = useState<string>("scenario name")

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
            onSubmit={closeAddItem}
            label="scenario"
        />
        <ConfirmDeleteModal
            opened={confirmDeleteOpened}
            onCancel={closeConfirmDelete}
            onConfirm={closeConfirmDelete}
            label="scenario"
            name={toDelete}
        />
        <ItemList
            items={scenarios}
            href={SCENARIO_HREF}
            onAdd={openAddItem}
            onDelete={(id, name) => {
                setToDelete(name);
                openConfirmDelete();
            }}
        />
    </>
}
