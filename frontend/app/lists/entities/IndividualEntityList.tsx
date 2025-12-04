import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {
    deleteItemRouteEntitiesItemIdDelete,
    type IndividualEntityGet,
    type IndividualEntityPost,
    postItemRouteEntitiesPost
} from "../../../client";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {AddIndividualEntityModal} from "~/modals/AddItemModal/entities/AddIndividualEntityModal";
import {useListDelete} from "~/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {useIndividualEntityPostFormContext} from "~/forms/entity/contexts";
import {INDIVIDUAL_ENTITY_PARAMS} from "~/page_params/entities";
import type {DeleteItemApi, PostItemApi} from "~/lib/types";

const NAME_COLUMN: Column<IndividualEntityGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const DESCRIPTION_COLUMN: Column<IndividualEntityGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<IndividualEntityGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<IndividualEntityGet>[] = ["name", "description"]

export interface Props {
    items?: IndividualEntityGet[]
    onChange?: (items: IndividualEntityGet[]) => void
}

export function IndividualEntityList(
    {
        items = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-item", "confirm-delete"])
    const form = useIndividualEntityPostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const postItem = useListPost<IndividualEntityPost, IndividualEntityGet>({
        items: items,
        onPostSuccess: (items) => {
            stack.close("add-item")
            onChange(items)
        },
        onPost: postItemRouteEntitiesPost as PostItemApi<IndividualEntityPost, IndividualEntityGet>,
        onBeginPost: startAddingItem,
        onEndPost: stopAddingItem,
    })

    const {setToDelete, deleteItem} = useListDelete<IndividualEntityGet>({
        items: items,
        onDeleteSuccess: (items) => {
            stack.close("confirm-delete")
            onChange(items)
        },
        onDelete: deleteItemRouteEntitiesItemIdDelete as DeleteItemApi<IndividualEntityGet>,
        onBeginDelete: startDeletingItem,
        onEndDelete: stopDeletingItem,
    })

    const onAdd = useCallback(() => {
        const initialValues: IndividualEntityPost = {
            type: "individual_entity",
            name: "",
            description: "",
            bank_accounts: [],
            scenarios: [],
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-item")
    }, [])

    const onDelete = useCallback((item: IndividualEntityGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(INDIVIDUAL_ENTITY_PARAMS.confirmDeleteItemModalPrompt(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddIndividualEntityModal
                {...stack.register("add-item")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-item")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={INDIVIDUAL_ENTITY_PARAMS.confirmDeleteItemModalTitle}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={items}
            getItemPageParams={INDIVIDUAL_ENTITY_PARAMS.getItemPageParams}
            href={INDIVIDUAL_ENTITY_PARAMS.itemHref}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}