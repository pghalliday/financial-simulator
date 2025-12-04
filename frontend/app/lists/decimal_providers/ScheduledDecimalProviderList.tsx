import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {
    deleteItemRouteDecimalProvidersItemIdDelete,
    postItemRouteDecimalProvidersPost,
    type ScheduledDecimalProviderGet,
    type ScheduledDecimalProviderPost
} from "../../../client";
import type {DeleteItemApi, PostItemApi} from "~/lib/types";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {useListDelete} from "~/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {
    AddScheduledDecimalProviderModal
} from "~/modals/AddItemModal/decimal_providers/AddScheduledDecimalProviderModal";
import {useScheduledDecimalProviderPostFormContext} from "~/forms/decimal_provider/contexts";
import {SCHEDULED_DECIMAL_PROVIDER_PARAMS} from "~/page_params/decimal_providers";

const NAME_COLUMN: Column<ScheduledDecimalProviderGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const DESCRIPTION_COLUMN: Column<ScheduledDecimalProviderGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<ScheduledDecimalProviderGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<ScheduledDecimalProviderGet>[] = ["name", "description"]

export interface Props {
    decimalProviders?: ScheduledDecimalProviderGet[]
    onChange?: (items: ScheduledDecimalProviderGet[]) => void
}

export function ScheduledDecimalProviderList(
    {
        decimalProviders = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-decimal-provider", "confirm-delete"])
    const form = useScheduledDecimalProviderPostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const postItem = useListPost<ScheduledDecimalProviderPost, ScheduledDecimalProviderGet>({
        items: decimalProviders,
        onPostSuccess: (items) => {
            stack.close("add-decimal-provider")
            onChange(items)
        },
        onPost: postItemRouteDecimalProvidersPost as PostItemApi<ScheduledDecimalProviderPost, ScheduledDecimalProviderGet>,
        onBeginPost: startAddingItem,
        onEndPost: stopAddingItem,
    })

    const {setToDelete, deleteItem} = useListDelete<ScheduledDecimalProviderGet>({
        items: decimalProviders,
        onDeleteSuccess: (items) => {
            stack.close("confirm-delete")
            onChange(items)
        },
        onDelete: deleteItemRouteDecimalProvidersItemIdDelete as DeleteItemApi<ScheduledDecimalProviderGet>,
        onBeginDelete: startDeletingItem,
        onEndDelete: stopDeletingItem,
    })

    const onAdd = useCallback(() => {
        const initialValues: ScheduledDecimalProviderPost = {
            type: "scheduled_decimal_provider",
            name: "",
            description: "",
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-decimal-provider")
    }, [])

    const onDelete = useCallback((item: ScheduledDecimalProviderGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(SCHEDULED_DECIMAL_PROVIDER_PARAMS.confirmDeleteItemModalPrompt(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddScheduledDecimalProviderModal
                {...stack.register("add-decimal-provider")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-decimal-provider")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={SCHEDULED_DECIMAL_PROVIDER_PARAMS.confirmDeleteItemModalTitle}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={decimalProviders}
            getItemPageParams={SCHEDULED_DECIMAL_PROVIDER_PARAMS.getItemPageParams}
            href={SCHEDULED_DECIMAL_PROVIDER_PARAMS.itemHref}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}