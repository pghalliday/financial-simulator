import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {
    deleteItemRouteScenariosItemIdDelete,
    postItemRouteScenariosPost,
    type ScenarioGet,
    type ScenarioPost
} from "../../../client";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {AddScenarioModal} from "~/modals/AddItemModal/scenarios/AddScenarioModal";
import {useListDelete} from "~/hooks/useListDelete";

import {Modal, useModalsStack} from "@mantine/core";
import {useScenarioPostFormContext} from "~/forms/scenario/contexts";
import {SCENARIO_PARAMS} from "~/page_params/scenarios";

const NAME_COLUMN: Column<ScenarioGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const DESCRIPTION_COLUMN: Column<ScenarioGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<ScenarioGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<ScenarioGet>[] = ["name", "description"]

export interface Props {
    scenarios?: ScenarioGet[]
    onChange?: (items: ScenarioGet[]) => void
}

export function ScenarioList(
    {
        scenarios = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-scenario", "confirm-delete"])
    const form = useScenarioPostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const postItem = useListPost<ScenarioPost, ScenarioGet>({
        items: scenarios,
        onPostSuccess: (items) => {
            stack.close("add-scenario")
            onChange(items)
        },
        onPost: postItemRouteScenariosPost,
        onBeginPost: startAddingItem,
        onEndPost: stopAddingItem,
    })

    const {setToDelete, deleteItem} = useListDelete<ScenarioGet>({
        items: scenarios,
        onDeleteSuccess: (items) => {
            stack.close("confirm-delete")
            onChange(items)
        },
        onDelete: deleteItemRouteScenariosItemIdDelete,
        onBeginDelete: startDeletingItem,
        onEndDelete: stopDeletingItem,
    })

    const onAdd = useCallback(() => {
        const initialValues = {
            name: "",
            description: "",
            entities: [],
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-scenario")
    }, [])

    const onDelete = useCallback((item: ScenarioGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(SCENARIO_PARAMS.confirmDeleteItemModalPrompt(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddScenarioModal
                {...stack.register("add-scenario")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-scenario")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={SCENARIO_PARAMS.confirmDeleteItemModalTitle}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={scenarios}
            getItemPageParams={SCENARIO_PARAMS.getItemPageParams}
            href={SCENARIO_PARAMS.itemHref}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}