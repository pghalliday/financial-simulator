import {
    PROVIDER_HREF,
    PROVIDER_TYPES,
    PROVIDERS_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    PROVIDERS_CONFIRM_DELETE_ITEM_MODAL_TITLE
} from "~/strings";
import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {type AlwaysProviderPost, deleteItemRouteProvidersItemIdDelete, postItemRouteProvidersPost} from "../../client";
import type {ProviderGet, ProviderPost} from "~/lib/types";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/lib/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {useListDelete} from "~/lib/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {AddProviderModal} from "~/modals/AddItemModal/AddProviderModal";
import {useProviderPostFormContext} from "~/forms/provider/ProviderPostFormContext";
import {getProviderPageParams} from "~/routes/Provider";

const NAME_COLUMN: Column<ProviderGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const TYPE_COLUMN: Column<ProviderGet> = {
    heading: "Type",
    hasLink: false,
    compare: (a, b) => PROVIDER_TYPES[a.type].localeCompare(PROVIDER_TYPES[b.type]),
    render: (item) => PROVIDER_TYPES[item.type],
}

const DESCRIPTION_COLUMN: Column<ProviderGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, TYPE_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<ProviderGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: TYPE_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<ProviderGet>[] = ["name", "description"]

export interface Props {
    providers?: ProviderGet[]
    onChange?: (items: ProviderGet[]) => void
}

export function ProviderList(
    {
        providers = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-provider", "confirm-delete"])
    const form = useProviderPostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const postItem = useListPost<ProviderPost, ProviderGet>({
        items: providers,
        onPostSuccess: (items) => {
            stack.close("add-provider")
            onChange(items)
        },
        onPost: postItemRouteProvidersPost,
        onBeginPost: startAddingItem,
        onEndPost: stopAddingItem,
    })

    const {setToDelete, deleteItem} = useListDelete<ProviderPost, ProviderGet>({
        items: providers,
        onDeleteSuccess: (items) => {
            stack.close("confirm-delete")
            onChange(items)
        },
        onDelete: deleteItemRouteProvidersItemIdDelete,
        onBeginDelete: startDeletingItem,
        onEndDelete: stopDeletingItem,
    })

    const onAdd = useCallback(() => {
        const initialValues: AlwaysProviderPost = {
            type: "always_provider",
            name: "",
            description: "",
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-provider")
    }, [])

    const onDelete = useCallback((item: ProviderGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(PROVIDERS_CONFIRM_DELETE_ITEM_MODAL_PROMPT(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddProviderModal
                {...stack.register("add-provider")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-provider")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={PROVIDERS_CONFIRM_DELETE_ITEM_MODAL_TITLE}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={providers}
            getItemPageParams={getProviderPageParams}
            href={PROVIDER_HREF}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}