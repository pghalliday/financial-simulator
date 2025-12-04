import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {
    deleteItemRouteRatesItemIdDelete,
    type PeriodicRateGet,
    type PeriodicRatePost,
    postItemRouteRatesPost
} from "../../../client";
import type {DeleteItemApi, PostItemApi} from "~/lib/types";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {useListDelete} from "~/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {AddPeriodicRateModal} from "~/modals/AddItemModal/rates/AddPeriodicRateModal";
import {usePeriodicRatePostFormContext} from "~/forms/rate/contexts";
import {PERIODIC_RATE_PARAMS} from "~/page_params/rates";

const NAME_COLUMN: Column<PeriodicRateGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const DESCRIPTION_COLUMN: Column<PeriodicRateGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<PeriodicRateGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<PeriodicRateGet>[] = ["name", "description"]

export interface Props {
    rates?: PeriodicRateGet[]
    onChange?: (items: PeriodicRateGet[]) => void
}

export function PeriodicRateList(
    {
        rates = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-rate", "confirm-delete"])
    const form = usePeriodicRatePostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const postItem = useListPost<PeriodicRatePost, PeriodicRateGet>({
        items: rates,
        onPostSuccess: (items) => {
            stack.close("add-rate")
            onChange(items)
        },
        onPost: postItemRouteRatesPost as PostItemApi<PeriodicRatePost, PeriodicRateGet>,
        onBeginPost: startAddingItem,
        onEndPost: stopAddingItem,
    })

    const {setToDelete, deleteItem} = useListDelete<PeriodicRateGet>({
        items: rates,
        onDeleteSuccess: (items) => {
            stack.close("confirm-delete")
            onChange(items)
        },
        onDelete: deleteItemRouteRatesItemIdDelete as DeleteItemApi<PeriodicRateGet>,
        onBeginDelete: startDeletingItem,
        onEndDelete: stopDeletingItem,
    })

    const onAdd = useCallback(() => {
        const initialValues: PeriodicRatePost = {
            type: "periodic_rate",
            name: "",
            description: "",
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-rate")
    }, [])

    const onDelete = useCallback((item: PeriodicRateGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(PERIODIC_RATE_PARAMS.confirmDeleteItemModalPrompt(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddPeriodicRateModal
                {...stack.register("add-rate")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-rate")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={PERIODIC_RATE_PARAMS.confirmDeleteItemModalTitle}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={rates}
            getItemPageParams={PERIODIC_RATE_PARAMS.getItemPageParams}
            href={PERIODIC_RATE_PARAMS.itemHref}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}