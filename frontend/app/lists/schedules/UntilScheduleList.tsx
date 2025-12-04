import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {
    deleteItemRouteSchedulesItemIdDelete,
    postItemRouteSchedulesPost,
    type UntilScheduleGet,
    type UntilSchedulePost
} from "../../../client";
import type {DeleteItemApi, PostItemApi} from "~/lib/types";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {useListDelete} from "~/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {AddUntilScheduleModal} from "~/modals/AddItemModal/schedules/AddUntilScheduleModal";
import {useUntilSchedulePostFormContext} from "~/forms/schedule/contexts";
import {UNTIL_SCHEDULE_PARAMS} from "~/page_params/schedules";

const NAME_COLUMN: Column<UntilScheduleGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const DESCRIPTION_COLUMN: Column<UntilScheduleGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<UntilScheduleGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<UntilScheduleGet>[] = ["name", "description"]

export interface Props {
    schedules?: UntilScheduleGet[]
    onChange?: (items: UntilScheduleGet[]) => void
}

export function UntilScheduleList(
    {
        schedules = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-schedule", "confirm-delete"])
    const form = useUntilSchedulePostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const postItem = useListPost<UntilSchedulePost, UntilScheduleGet>({
        items: schedules,
        onPostSuccess: (items) => {
            stack.close("add-schedule")
            onChange(items)
        },
        onPost: postItemRouteSchedulesPost as PostItemApi<UntilSchedulePost, UntilScheduleGet>,
        onBeginPost: startAddingItem,
        onEndPost: stopAddingItem,
    })

    const {setToDelete, deleteItem} = useListDelete<UntilScheduleGet>({
        items: schedules,
        onDeleteSuccess: (items) => {
            stack.close("confirm-delete")
            onChange(items)
        },
        onDelete: deleteItemRouteSchedulesItemIdDelete as DeleteItemApi<UntilScheduleGet>,
        onBeginDelete: startDeletingItem,
        onEndDelete: stopDeletingItem,
    })

    const onAdd = useCallback(() => {
        const initialValues: UntilSchedulePost = {
            type: "until_schedule",
            name: "",
            description: "",
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-schedule")
    }, [])

    const onDelete = useCallback((item: UntilScheduleGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(UNTIL_SCHEDULE_PARAMS.confirmDeleteItemModalPrompt(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddUntilScheduleModal
                {...stack.register("add-schedule")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-schedule")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={UNTIL_SCHEDULE_PARAMS.confirmDeleteItemModalTitle}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={schedules}
            getItemPageParams={UNTIL_SCHEDULE_PARAMS.getItemPageParams}
            href={UNTIL_SCHEDULE_PARAMS.itemHref}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}