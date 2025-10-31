import {
    ENTITIES_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    ENTITIES_CONFIRM_DELETE_ITEM_MODAL_TITLE,
    ENTITY_HREF,
    ENTITY_TYPES
} from "~/strings";
import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {deleteItemRouteEntitiesItemIdDelete, type IndividualEntityPost, postItemRouteEntitiesPost} from "~/client";
import type {EntityGet, EntityPost} from "~/lib/types";
import {getEntityPageParams} from "~/routes/Entity";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/lib/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {AddEntityModal} from "~/modals/AddItemModal/AddEntityModal";
import {useListDelete} from "~/lib/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {useFormContext} from "~/lib/hooks/useFormContext";
import {ENTITY_POST_FORM_NAME} from "~/forms/entity/EntityPostFormContext";

const NAME_COLUMN: Column<EntityGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const TYPE_COLUMN: Column<EntityGet> = {
    heading: "Type",
    hasLink: false,
    compare: (a, b) => ENTITY_TYPES[a.type].localeCompare(ENTITY_TYPES[b.type]),
    render: (item) => ENTITY_TYPES[item.type],
}

const DESCRIPTION_COLUMN: Column<EntityGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, TYPE_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<EntityGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: TYPE_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<EntityGet>[] = ["name", "description"]

export interface Props {
    entities?: EntityGet[]
    onChange?: (items: EntityGet[]) => void
}

export function EntityList(
    {
        entities = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-entity", "confirm-delete"])
    const form = useFormContext(ENTITY_POST_FORM_NAME)
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const postItem = useListPost<EntityPost, EntityGet>({
        items: entities,
        onPostSuccess: (items) => {
            stack.close("add-entity")
            onChange(items)
        },
        onPost: postItemRouteEntitiesPost,
        onBeginPost: startAddingItem,
        onEndPost: stopAddingItem,
    })

    const {setToDelete, deleteItem} = useListDelete<EntityPost, EntityGet>({
        items: entities,
        onDeleteSuccess: (items) => {
            stack.close("confirm-delete")
            onChange(items)
        },
        onDelete: deleteItemRouteEntitiesItemIdDelete,
        onBeginDelete: startDeletingItem,
        onEndDelete: stopDeletingItem,
    })

    const onAdd = useCallback(() => {
        const initialValues: IndividualEntityPost = {
            type: "individual_entity",
            name: "",
            description: "",
            scenarios: [],
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-entity")
    }, [])

    const onDelete = useCallback((item: EntityGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(ENTITIES_CONFIRM_DELETE_ITEM_MODAL_PROMPT(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddEntityModal
                {...stack.register("add-entity")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-entity")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={ENTITIES_CONFIRM_DELETE_ITEM_MODAL_TITLE}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={entities}
            getItemPageParams={getEntityPageParams}
            href={ENTITY_HREF}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}