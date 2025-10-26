import {AddItemModal} from "~/components/modals/AddItemModal";
import {ConfirmDeleteModal} from "~/components/modals/ConfirmDeleteModal";
import {
    SCENARIO_HREF,
    SCENARIOS_ADD_ITEM_MODAL_TITLE,
    SCENARIOS_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    SCENARIOS_CONFIRM_DELETE_ITEM_MODAL_TITLE
} from "~/strings";
import {type Column, ItemList, type SearchKeys, type SortBy} from "~/components/controls/item_list/ItemList";
import {useDisclosure} from "@mantine/hooks";
import {useCallback, useEffect, useState} from "react";
import {
    deleteItemRouteScenariosItemIdDelete,
    postItemRouteScenariosPost,
    type ScenarioGet,
    type ScenarioPost
} from "~/client";
import {useItemPost} from "~/lib/hooks/useItemPost";
import {validateScenarioPost} from "~/lib/validators";
import {usePostItem} from "~/lib/hooks/usePostItem";
import {useDeleteItem} from "~/lib/hooks/useDeleteItem";
import {ScenarioPostForm} from "~/components/forms/ScenarioPostForm";
import {getScenarioPageParams} from "~/routes/Scenario";

const NAME_COLUMN: Column<ScenarioGet> = {
    field: "name",
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.localeCompare(b),
}

const DESCRIPTION_COLUMN: Column<ScenarioGet> = {
    field: "description",
    heading: "Description",
    hasLink: false,
    compare: (a, b) => a.localeCompare(b),
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

export function ScenarioList({
                                 items
                             }: {
    items: ScenarioGet[]
}) {
    const [internalItems, setInternalItems] = useState<ScenarioGet[]>([])
    useEffect(() => {
        setInternalItems(items)
    }, [items]);

    const [addItemModalOpened, {open: openAddItemModal, close: closeAddItemModal}] = useDisclosure()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState("")
    const [confirmDeleteItemModalOpened, {
        open: openConfirmDeleteItemModal,
        close: closeConfirmDeleteItemModal
    }] = useDisclosure()
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()
    const postItem = usePostItem<ScenarioPost, ScenarioGet>(
        internalItems,
        setInternalItems,
        postItemRouteScenariosPost,
        startAddingItem,
        stopAddingItem,
        closeAddItemModal
    )
    const {setToDelete, deleteItem} = useDeleteItem(
        internalItems,
        setInternalItems,
        deleteItemRouteScenariosItemIdDelete,
        startDeletingItem,
        stopDeletingItem,
        closeConfirmDeleteItemModal
    )
    const {setItemPost, getField, setField, valid, submit} = useItemPost(
        validateScenarioPost,
        postItem,
    )

    const startAddItem = useCallback(() => {
        setItemPost({
            name: "",
            description: "",
        })
        openAddItemModal()
    }, [internalItems])

    const startDeleteItem = useCallback((item: ScenarioGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(SCENARIOS_CONFIRM_DELETE_ITEM_MODAL_PROMPT(item.name))
        openConfirmDeleteItemModal()
    }, [internalItems])

    return <>
        <AddItemModal
            opened={addItemModalOpened}
            working={addingItem}
            title={SCENARIOS_ADD_ITEM_MODAL_TITLE}
            onSubmit={submit}
            submitDisabled={!valid}
            onCancel={closeAddItemModal}
        >
            <ScenarioPostForm getField={getField} setField={setField}/>
        </AddItemModal>
        <ConfirmDeleteModal
            opened={confirmDeleteItemModalOpened}
            working={deletingItem}
            title={SCENARIOS_CONFIRM_DELETE_ITEM_MODAL_TITLE}
            prompt={confirmDeletePrompt}
            onConfirm={deleteItem}
            onCancel={closeConfirmDeleteItemModal}
        />
        <ItemList
            columns={COLUMNS}
            items={internalItems}
            getItemPageParams={getScenarioPageParams}
            href={SCENARIO_HREF}
            onAdd={startAddItem}
            onDelete={startDeleteItem}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}