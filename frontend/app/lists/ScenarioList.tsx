import {
    SCENARIO_HREF,
    SCENARIOS_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    SCENARIOS_CONFIRM_DELETE_ITEM_MODAL_TITLE
} from "~/strings";
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
} from "~/client";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/lib/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {AddScenarioModal} from "~/modals/AddItemModal/AddScenarioModal";
import {useListDelete} from "~/lib/hooks/useListDelete";

import {getScenarioPageParams} from "~/routes/Scenario";
import {Modal, useModalsStack} from "@mantine/core";
import {useFormContext} from "~/lib/hooks/useFormContext";
import {SCENARIO_POST_FORM_NAME} from "~/forms/scenario/ScenarioPostFormContext";

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
    const form = useFormContext(SCENARIO_POST_FORM_NAME)
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

    const {setToDelete, deleteItem} = useListDelete<ScenarioPost, ScenarioGet>({
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
        setConfirmDeletePrompt(SCENARIOS_CONFIRM_DELETE_ITEM_MODAL_PROMPT(item))
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
                title={SCENARIOS_CONFIRM_DELETE_ITEM_MODAL_TITLE}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={scenarios}
            getItemPageParams={getScenarioPageParams}
            href={SCENARIO_HREF}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}