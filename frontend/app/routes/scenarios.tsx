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
import {deleteItemScenariosItemIdDelete, getItemsScenariosGet, postItemScenariosPost, type ScenarioPost} from "~/client"
import {ItemList, type ToDeleteData} from "~/components/ItemList";
import {ApiError} from "~/ApiError";
import {useDisclosure} from "@mantine/hooks";
import {AddItemModal, type ToAddData} from "~/components/AddItemModal";
import {ConfirmDeleteModal} from "~/components/ConfirmDeleteModal";

const INITIAL_TO_ADD_DATA: ToAddData = {
    name: "",
    description: "",
    type: null,
}

export async function clientLoader() {
    const {data, error, response} = await getItemsScenariosGet()
    if (data !== undefined) {
        return data
    }
    throw new ApiError(response.status, response.statusText, error)
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
    const [confirmDeleteData, setConfirmDeleteData] = useState<string>()
    const [toAddData, setToAddData] = useState<ToAddData>()

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

    useEffect(() => {
        if (toAddData !== undefined) {
            postItemScenariosPost({
                // TODO: can we properly type toAddData?
                body: toAddData as ScenarioPost,
            }).then(({data, error, response}) => {
                if (data != undefined) {
                    setScenarios(scenarios.concat([data]))
                    closeAddItem()
                } else {
                    console.error(`${response.status}: ${response.statusText}: ${error}`)
                }
            })
        }
    }, [toAddData])

    useEffect(() => {
        if (confirmDeleteData != undefined) {
            deleteItemScenariosItemIdDelete({
                path: {
                    item_id: confirmDeleteData
                }
            }).then(({data, error, response}) => {
                if (data != undefined) {
                    setScenarios(scenarios.filter(scenario => scenario.id !== data.id))
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
            collectionLabel="scenario"
        />
        <ConfirmDeleteModal
            opened={confirmDeleteOpened}
            onCancel={closeConfirmDelete}
            onConfirm={() => {
                setConfirmDeleteData(toDeleteData.id)
            }}
            collectionLabel="scenario"
            itemName={toDeleteData.name}
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
