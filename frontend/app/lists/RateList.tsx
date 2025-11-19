import {
    RATE_HREF,
    RATE_TYPES,
    RATES_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    RATES_CONFIRM_DELETE_ITEM_MODAL_TITLE
} from "~/strings";
import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {type ContinuousRatePost, deleteItemRouteRatesItemIdDelete, postItemRouteRatesPost} from "../../client";
import type {RateGet, RatePost} from "~/lib/types";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/lib/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {useListDelete} from "~/lib/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {useRatePostFormContext} from "~/forms/rate/RatePostFormContext";
import {AddRateModal} from "~/modals/AddItemModal/AddRateModal";
import {getRatePageParams} from "~/routes/Rate";

const NAME_COLUMN: Column<RateGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const TYPE_COLUMN: Column<RateGet> = {
    heading: "Type",
    hasLink: false,
    compare: (a, b) => RATE_TYPES[a.type].localeCompare(RATE_TYPES[b.type]),
    render: (item) => RATE_TYPES[item.type],
}

const DESCRIPTION_COLUMN: Column<RateGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, TYPE_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<RateGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: TYPE_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<RateGet>[] = ["name", "description"]

export interface Props {
    rates?: RateGet[]
    onChange?: (items: RateGet[]) => void
}

export function RateList(
    {
        rates = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-rate", "confirm-delete"])
    const form = useRatePostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const postItem = useListPost<RatePost, RateGet>({
        items: rates,
        onPostSuccess: (items) => {
            stack.close("add-rate")
            onChange(items)
        },
        onPost: postItemRouteRatesPost,
        onBeginPost: startAddingItem,
        onEndPost: stopAddingItem,
    })

    const {setToDelete, deleteItem} = useListDelete<RatePost, RateGet>({
        items: rates,
        onDeleteSuccess: (items) => {
            stack.close("confirm-delete")
            onChange(items)
        },
        onDelete: deleteItemRouteRatesItemIdDelete,
        onBeginDelete: startDeletingItem,
        onEndDelete: stopDeletingItem,
    })

    const onAdd = useCallback(() => {
        const initialValues: ContinuousRatePost = {
            type: "continuous_rate",
            name: "",
            description: "",
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-rate")
    }, [])

    const onDelete = useCallback((item: RateGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(RATES_CONFIRM_DELETE_ITEM_MODAL_PROMPT(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddRateModal
                {...stack.register("add-rate")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-rate")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={RATES_CONFIRM_DELETE_ITEM_MODAL_TITLE}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={rates}
            getItemPageParams={getRatePageParams}
            href={RATE_HREF}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}