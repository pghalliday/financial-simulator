import {
    RATE_PROVIDER_HREF,
    RATE_PROVIDER_TYPES,
    RATE_PROVIDERS_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    RATE_PROVIDERS_CONFIRM_DELETE_ITEM_MODAL_TITLE
} from "~/strings";
import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {
    deleteItemRouteRateProvidersItemIdDelete,
    postItemRouteRateProvidersPost,
    type ScheduledRateProviderPost
} from "../../client";
import type {RateProviderGet, RateProviderPost} from "~/lib/types";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/lib/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {useListDelete} from "~/lib/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {AddRateProviderModal} from "~/modals/AddItemModal/AddRateProviderModal";
import {useRateProviderPostFormContext} from "~/forms/rate_provider/RateProviderPostFormContext";
import {getRateProviderPageParams} from "~/routes/RateProvider";

const NAME_COLUMN: Column<RateProviderGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const TYPE_COLUMN: Column<RateProviderGet> = {
    heading: "Type",
    hasLink: false,
    compare: (a, b) => RATE_PROVIDER_TYPES[a.type].localeCompare(RATE_PROVIDER_TYPES[b.type]),
    render: (item) => RATE_PROVIDER_TYPES[item.type],
}

const DESCRIPTION_COLUMN: Column<RateProviderGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, TYPE_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<RateProviderGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: TYPE_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<RateProviderGet>[] = ["name", "description"]

export interface Props {
    rateProviders?: RateProviderGet[]
    onChange?: (items: RateProviderGet[]) => void
}

export function RateProviderList(
    {
        rateProviders = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-rate-provider", "confirm-delete"])
    const form = useRateProviderPostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

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

    const {setToDelete, deleteItem} = useListDelete<RateProviderPost, RateProviderGet>({
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

    const onDelete = useCallback((item: RateProviderGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(RATE_PROVIDERS_CONFIRM_DELETE_ITEM_MODAL_PROMPT(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddRateProviderModal
                {...stack.register("add-rate-provider")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-rate-provider")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={RATE_PROVIDERS_CONFIRM_DELETE_ITEM_MODAL_TITLE}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={rateProviders}
            getItemPageParams={getRateProviderPageParams}
            href={RATE_PROVIDER_HREF}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}