import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {
    type AllScheduleGet,
    type AllSchedulePost,
    deleteItemRouteSchedulesItemIdDelete,
    postItemRouteSchedulesPost,
    ScheduleType
} from "../../../client";
import type {ScheduleGet, SchedulePost} from "~/lib/types";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {useListDelete} from "~/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {AddAllScheduleModal} from "~/modals/AddItemModal/schedules/AddAllScheduleModal";
import {useAllSchedulePostFormContext} from "~/forms/schedule/contexts";
import {ALL_SCHEDULE_PARAMS} from "~/page_params/schedules";

const NAME_COLUMN: Column<AllScheduleGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const DESCRIPTION_COLUMN: Column<AllScheduleGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<AllScheduleGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<AllScheduleGet>[] = ["name", "description"]

export interface Props {
    schedules?: ScheduleGet[]
    onChange?: (items: ScheduleGet[]) => void
}

export function AllScheduleList(
    {
        schedules = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-schedule", "confirm-delete"])
    const form = useAllSchedulePostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const allSchedules = schedules?.filter(item => item.type === ScheduleType.ALL_SCHEDULE)

    const postItem = useListPost<SchedulePost, ScheduleGet>({
        items: schedules,
        onPostSuccess: (items) => {
            stack.close("add-schedule")
            onChange(items)
        },
        onPost: postItemRouteSchedulesPost,
        onBeginPost: startAddingItem,
        onEndPost: stopAddingItem,
    })

    const {setToDelete, deleteItem} = useListDelete<ScheduleGet>({
        items: schedules,
        onDeleteSuccess: (items) => {
            stack.close("confirm-delete")
            onChange(items)
        },
        onDelete: deleteItemRouteSchedulesItemIdDelete,
        onBeginDelete: startDeletingItem,
        onEndDelete: stopDeletingItem,
    })

    const onAdd = useCallback(() => {
        const initialValues: AllSchedulePost = {
            type: "all_schedule",
            name: "",
            description: "",
            schedules: [],
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-schedule")
    }, [])

    const onDelete = useCallback((item: AllScheduleGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(ALL_SCHEDULE_PARAMS.confirmDeleteItemModalPrompt(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddAllScheduleModal
                {...stack.register("add-schedule")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-schedule")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={ALL_SCHEDULE_PARAMS.confirmDeleteItemModalTitle}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={allSchedules}
            getItemPageParams={ALL_SCHEDULE_PARAMS.getItemPageParams}
            href={ALL_SCHEDULE_PARAMS.itemHref}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}