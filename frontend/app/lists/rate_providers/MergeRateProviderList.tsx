import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {
    deleteItemRouteRateProvidersItemIdDelete,
    type MergeRateProviderGet,
    type MergeRateProviderPost,
    postItemRouteRateProvidersPost
} from "../../../client";
import type {DeleteItemApi, PostItemApi} from "~/lib/types";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {useListDelete} from "~/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {AddMergeRateProviderModal} from "~/modals/AddItemModal/rate_providers/AddMergeRateProviderModal";
import {useMergeRateProviderPostFormContext} from "~/forms/rate_provider/contexts";
import {MERGE_RATE_PROVIDER_PARAMS} from "~/page_params/rate_providers";

const NAME_COLUMN: Column<MergeRateProviderGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const DESCRIPTION_COLUMN: Column<MergeRateProviderGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<MergeRateProviderGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<MergeRateProviderGet>[] = ["name", "description"]

export interface Props {
    rateProviders?: MergeRateProviderGet[]
    onChange?: (items: MergeRateProviderGet[]) => void
}

export function MergeRateProviderList(
    {
        rateProviders = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-rate-provider", "confirm-delete"])
    const form = useMergeRateProviderPostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const postItem = useListPost<MergeRateProviderPost, MergeRateProviderGet>({
        items: rateProviders,
        onPostSuccess: (items) => {
            stack.close("add-rate-provider")
            onChange(items)
        },
        onPost: postItemRouteRateProvidersPost as PostItemApi<MergeRateProviderPost, MergeRateProviderGet>,
        onBeginPost: startAddingItem,
        onEndPost: stopAddingItem,
    })

    const {setToDelete, deleteItem} = useListDelete<MergeRateProviderGet>({
        items: rateProviders,
        onDeleteSuccess: (items) => {
            stack.close("confirm-delete")
            onChange(items)
        },
        onDelete: deleteItemRouteRateProvidersItemIdDelete as DeleteItemApi<MergeRateProviderGet>,
        onBeginDelete: startDeletingItem,
        onEndDelete: stopDeletingItem,
    })

    const onAdd = useCallback(() => {
        const initialValues: MergeRateProviderPost = {
            type: "merge_rate_provider",
            name: "",
            description: "",
            rate_providers: [],
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-rate-provider")
    }, [])

    const onDelete = useCallback((item: MergeRateProviderGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(MERGE_RATE_PROVIDER_PARAMS.confirmDeleteItemModalPrompt(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddMergeRateProviderModal
                {...stack.register("add-rate-provider")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-rate-provider")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={MERGE_RATE_PROVIDER_PARAMS.confirmDeleteItemModalTitle}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={rateProviders}
            getItemPageParams={MERGE_RATE_PROVIDER_PARAMS.getItemPageParams}
            href={MERGE_RATE_PROVIDER_PARAMS.itemHref}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}