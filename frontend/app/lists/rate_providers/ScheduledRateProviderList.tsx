import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {
    deleteItemRouteRateProvidersItemIdDelete,
    postItemRouteRateProvidersPost,
    RateProviderType,
    type ScheduledRateProviderGet,
    type ScheduledRateProviderPost
} from "../../../client";
import type {RateProviderGet, RateProviderPost} from "~/lib/types";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {useListDelete} from "~/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {AddScheduledRateProviderModal} from "~/modals/AddItemModal/rate_providers/AddScheduledRateProviderModal";
import {useScheduledRateProviderPostFormContext} from "~/forms/rate_provider/contexts";
import {SCHEDULED_RATE_PROVIDER_PARAMS} from "~/page_params/rate_providers";

const NAME_COLUMN: Column<ScheduledRateProviderGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const DESCRIPTION_COLUMN: Column<ScheduledRateProviderGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<ScheduledRateProviderGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<ScheduledRateProviderGet>[] = ["name", "description"]

export interface Props {
    rateProviders?: RateProviderGet[]
    onChange?: (items: RateProviderGet[]) => void
}

export function ScheduledRateProviderList(
    {
        rateProviders = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-rate-provider", "confirm-delete"])
    const form = useScheduledRateProviderPostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const scheduledRateProviders = rateProviders?.filter(item => item.type === RateProviderType.SCHEDULED_RATE_PROVIDER)

    const postItem = useListPost<RateProviderPost, RateProviderGet>({
        items: rateProviders,
        onPostSuccess: (items) => {
            stack.close("add-rate-provider")
            onChange(items)
        },
        onPost: postItemRouteRateProvidersPost,
        onBeginPost: startAddingItem,
        onEndPost: stopAddingItem,
    })

    const {setToDelete, deleteItem} = useListDelete<RateProviderGet>({
        items: rateProviders,
        onDeleteSuccess: (items) => {
            stack.close("confirm-delete")
            onChange(items)
        },
        onDelete: deleteItemRouteRateProvidersItemIdDelete,
        onBeginDelete: startDeletingItem,
        onEndDelete: stopDeletingItem,
    })

    const onAdd = useCallback(() => {
        const initialValues: ScheduledRateProviderPost = {
            type: "scheduled_rate_provider",
            name: "",
            description: "",
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-rate-provider")
    }, [])

    const onDelete = useCallback((item: ScheduledRateProviderGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(SCHEDULED_RATE_PROVIDER_PARAMS.confirmDeleteItemModalPrompt(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddScheduledRateProviderModal
                {...stack.register("add-rate-provider")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-rate-provider")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={SCHEDULED_RATE_PROVIDER_PARAMS.confirmDeleteItemModalTitle}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={scheduledRateProviders}
            getItemPageParams={SCHEDULED_RATE_PROVIDER_PARAMS.getItemPageParams}
            href={SCHEDULED_RATE_PROVIDER_PARAMS.itemHref}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}