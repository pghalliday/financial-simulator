import {
    VALUE_HREF,
    VALUE_TYPES,
    VALUES_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    VALUES_CONFIRM_DELETE_ITEM_MODAL_TITLE
} from "~/strings";
import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {type DecimalValuePost, deleteItemRouteValuesItemIdDelete, postItemRouteValuesPost} from "../../client";
import type {ValueGet, ValuePost} from "~/lib/types";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/lib/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {useListDelete} from "~/lib/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {useValuePostFormContext} from "~/forms/value/ValuePostFormContext";
import {AddValueModal} from "~/modals/AddItemModal/AddValueModal";
import {getValuePageParams} from "~/routes/Value";

const NAME_COLUMN: Column<ValueGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const TYPE_COLUMN: Column<ValueGet> = {
    heading: "Type",
    hasLink: false,
    compare: (a, b) => VALUE_TYPES[a.type].localeCompare(VALUE_TYPES[b.type]),
    render: (item) => VALUE_TYPES[item.type],
}

const DESCRIPTION_COLUMN: Column<ValueGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, TYPE_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<ValueGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: TYPE_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<ValueGet>[] = ["name", "description"]

export interface Props {
    values?: ValueGet[]
    onChange?: (items: ValueGet[]) => void
}

export function ValueList(
    {
        values = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-value", "confirm-delete"])
    const form = useValuePostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const postItem = useListPost<ValuePost, ValueGet>({
        items: values,
        onPostSuccess: (items) => {
            stack.close("add-value")
            onChange(items)
        },
        onPost: postItemRouteValuesPost,
        onBeginPost: startAddingItem,
        onEndPost: stopAddingItem,
    })

    const {setToDelete, deleteItem} = useListDelete<ValuePost, ValueGet>({
        items: values,
        onDeleteSuccess: (items) => {
            stack.close("confirm-delete")
            onChange(items)
        },
        onDelete: deleteItemRouteValuesItemIdDelete,
        onBeginDelete: startDeletingItem,
        onEndDelete: stopDeletingItem,
    })

    const onAdd = useCallback(() => {
        const initialValues: DecimalValuePost = {
            type: "decimal_value",
            name: "",
            description: "",
            value: 0,
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-value")
    }, [])

    const onDelete = useCallback((item: ValueGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(VALUES_CONFIRM_DELETE_ITEM_MODAL_PROMPT(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddValueModal
                {...stack.register("add-value")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-value")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={VALUES_CONFIRM_DELETE_ITEM_MODAL_TITLE}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={values}
            getItemPageParams={getValuePageParams}
            href={VALUE_HREF}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}