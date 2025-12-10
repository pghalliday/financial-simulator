import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {
    DecimalProviderType,
    deleteItemRouteDecimalProvidersItemIdDelete,
    type MergeDecimalProviderGet,
    type MergeDecimalProviderPost,
    postItemRouteDecimalProvidersPost
} from "../../../client";
import type {DecimalProviderGet, DecimalProviderPost} from "~/lib/types";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {useListDelete} from "~/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {AddMergeDecimalProviderModal} from "~/modals/AddItemModal/decimal_providers/AddMergeDecimalProviderModal";
import {useMergeDecimalProviderPostFormContext} from "~/forms/decimal_provider/contexts";
import {MERGE_DECIMAL_PROVIDER_PARAMS} from "~/page_params/decimal_providers";

const NAME_COLUMN: Column<MergeDecimalProviderGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const DESCRIPTION_COLUMN: Column<MergeDecimalProviderGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<MergeDecimalProviderGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<MergeDecimalProviderGet>[] = ["name", "description"]

export interface Props {
    decimalProviders?: DecimalProviderGet[]
    onChange?: (items: DecimalProviderGet[]) => void
}

export function MergeDecimalProviderList(
    {
        decimalProviders = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-decimal-provider", "confirm-delete"])
    const form = useMergeDecimalProviderPostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const mergeDecimalProviders = decimalProviders?.filter(item => item.type === DecimalProviderType.MERGE_DECIMAL_PROVIDER)

    const postItem = useListPost<DecimalProviderPost, DecimalProviderGet>({
        items: decimalProviders,
        onPostSuccess: (items) => {
            stack.close("add-decimal-provider")
            onChange(items)
        },
        onPost: postItemRouteDecimalProvidersPost,
        onBeginPost: startAddingItem,
        onEndPost: stopAddingItem,
    })

    const {setToDelete, deleteItem} = useListDelete<DecimalProviderGet>({
        items: decimalProviders,
        onDeleteSuccess: (items) => {
            stack.close("confirm-delete")
            onChange(items)
        },
        onDelete: deleteItemRouteDecimalProvidersItemIdDelete,
        onBeginDelete: startDeletingItem,
        onEndDelete: stopDeletingItem,
    })

    const onAdd = useCallback(() => {
        const initialValues: MergeDecimalProviderPost = {
            type: "merge_decimal_provider",
            name: "",
            description: "",
            decimal_providers: [],
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-decimal-provider")
    }, [])

    const onDelete = useCallback((item: MergeDecimalProviderGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(MERGE_DECIMAL_PROVIDER_PARAMS.confirmDeleteItemModalPrompt(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddMergeDecimalProviderModal
                {...stack.register("add-decimal-provider")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-decimal-provider")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={MERGE_DECIMAL_PROVIDER_PARAMS.confirmDeleteItemModalTitle}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={mergeDecimalProviders}
            getItemPageParams={MERGE_DECIMAL_PROVIDER_PARAMS.getItemPageParams}
            href={MERGE_DECIMAL_PROVIDER_PARAMS.itemHref}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}