import {
    DECIMAL_PROVIDER_HREF,
    DECIMAL_PROVIDER_TYPES,
    DECIMAL_PROVIDERS_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    DECIMAL_PROVIDERS_CONFIRM_DELETE_ITEM_MODAL_TITLE
} from "~/strings";
import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {
    deleteItemRouteDecimalProvidersItemIdDelete,
    postItemRouteDecimalProvidersPost,
    type ScheduledDecimalProviderPost
} from "../../client";
import type {DecimalProviderGet, DecimalProviderPost} from "~/lib/types";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/lib/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {useListDelete} from "~/lib/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {AddDecimalProviderModal} from "~/modals/AddItemModal/AddDecimalProviderModal";
import {useDecimalProviderPostFormContext} from "~/forms/decimal_provider/DecimalProviderPostFormContext";
import {getDecimalProviderPageParams} from "~/routes/DecimalProvider";

const NAME_COLUMN: Column<DecimalProviderGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const TYPE_COLUMN: Column<DecimalProviderGet> = {
    heading: "Type",
    hasLink: false,
    compare: (a, b) => DECIMAL_PROVIDER_TYPES[a.type].localeCompare(DECIMAL_PROVIDER_TYPES[b.type]),
    render: (item) => DECIMAL_PROVIDER_TYPES[item.type],
}

const DESCRIPTION_COLUMN: Column<DecimalProviderGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, TYPE_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<DecimalProviderGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: TYPE_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<DecimalProviderGet>[] = ["name", "description"]

export interface Props {
    decimalProviders?: DecimalProviderGet[]
    onChange?: (items: DecimalProviderGet[]) => void
}

export function DecimalProviderList(
    {
        decimalProviders = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-decimal-provider", "confirm-delete"])
    const form = useDecimalProviderPostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

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

    const {setToDelete, deleteItem} = useListDelete<DecimalProviderPost, DecimalProviderGet>({
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
        const initialValues: ScheduledDecimalProviderPost = {
            type: "scheduled_decimal_provider",
            name: "",
            description: "",
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-decimal-provider")
    }, [])

    const onDelete = useCallback((item: DecimalProviderGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(DECIMAL_PROVIDERS_CONFIRM_DELETE_ITEM_MODAL_PROMPT(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddDecimalProviderModal
                {...stack.register("add-decimal-provider")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-decimal-provider")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={DECIMAL_PROVIDERS_CONFIRM_DELETE_ITEM_MODAL_TITLE}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={decimalProviders}
            getItemPageParams={getDecimalProviderPageParams}
            href={DECIMAL_PROVIDER_HREF}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}