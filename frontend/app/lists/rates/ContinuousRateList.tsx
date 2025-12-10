import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {
    type ContinuousRateGet,
    type ContinuousRatePost,
    deleteItemRouteRatesItemIdDelete,
    postItemRouteRatesPost,
    RateType
} from "../../../client";
import type {RateGet, RatePost} from "~/lib/types";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {useListDelete} from "~/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {AddContinuousRateModal} from "~/modals/AddItemModal/rates/AddContinuousRateModal";
import {useContinuousRatePostFormContext} from "~/forms/rate/contexts";
import {CONTINUOUS_RATE_PARAMS} from "~/page_params/rates";

const NAME_COLUMN: Column<ContinuousRateGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const DESCRIPTION_COLUMN: Column<ContinuousRateGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<ContinuousRateGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<ContinuousRateGet>[] = ["name", "description"]

export interface Props {
    rates?: RateGet[]
    onChange?: (items: RateGet[]) => void
}

export function ContinuousRateList(
    {
        rates = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-rate", "confirm-delete"])
    const form = useContinuousRatePostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const continuousRates = rates?.filter(item => item.type === RateType.CONTINUOUS_RATE)

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

    const {setToDelete, deleteItem} = useListDelete<RateGet>({
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

    const onDelete = useCallback((item: ContinuousRateGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(CONTINUOUS_RATE_PARAMS.confirmDeleteItemModalPrompt(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddContinuousRateModal
                {...stack.register("add-rate")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-rate")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={CONTINUOUS_RATE_PARAMS.confirmDeleteItemModalTitle}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={continuousRates}
            getItemPageParams={CONTINUOUS_RATE_PARAMS.getItemPageParams}
            href={CONTINUOUS_RATE_PARAMS.itemHref}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}