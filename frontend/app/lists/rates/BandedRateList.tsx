import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {
    type BandedRateGet,
    type BandedRatePost,
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
import {AddBandedRateModal} from "~/modals/AddItemModal/rates/AddBandedRateModal";
import {useBandedRatePostFormContext} from "~/forms/rate/contexts";
import {BANDED_RATE_PARAMS} from "~/page_params/rates";

const NAME_COLUMN: Column<BandedRateGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const DESCRIPTION_COLUMN: Column<BandedRateGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<BandedRateGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<BandedRateGet>[] = ["name", "description"]

export interface Props {
    rates?: RateGet[]
    onChange?: (items: RateGet[]) => void
}

export function BandedRateList(
    {
        rates = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-rate", "confirm-delete"])
    const form = useBandedRatePostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const bandedRates = rates?.filter(item => item.type === RateType.BANDED_RATE)

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
        const initialValues: BandedRatePost = {
            type: "banded_rate",
            name: "",
            description: "",
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-rate")
    }, [])

    const onDelete = useCallback((item: BandedRateGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(BANDED_RATE_PARAMS.confirmDeleteItemModalPrompt(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddBandedRateModal
                {...stack.register("add-rate")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-rate")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={BANDED_RATE_PARAMS.confirmDeleteItemModalTitle}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={bandedRates}
            getItemPageParams={BANDED_RATE_PARAMS.getItemPageParams}
            href={BANDED_RATE_PARAMS.itemHref}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}