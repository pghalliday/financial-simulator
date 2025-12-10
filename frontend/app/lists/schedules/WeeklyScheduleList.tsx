import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {
    deleteItemRouteSchedulesItemIdDelete,
    postItemRouteSchedulesPost,
    ScheduleType,
    type WeeklyScheduleGet,
    type WeeklySchedulePost
} from "../../../client";
import type {ScheduleGet, SchedulePost} from "~/lib/types";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {useListDelete} from "~/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {AddWeeklyScheduleModal} from "~/modals/AddItemModal/schedules/AddWeeklyScheduleModal";
import {useWeeklySchedulePostFormContext} from "~/forms/schedule/contexts";
import {WEEKLY_SCHEDULE_PARAMS} from "~/page_params/schedules";

const NAME_COLUMN: Column<WeeklyScheduleGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const DESCRIPTION_COLUMN: Column<WeeklyScheduleGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<WeeklyScheduleGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<WeeklyScheduleGet>[] = ["name", "description"]

export interface Props {
    schedules?: ScheduleGet[]
    onChange?: (items: ScheduleGet[]) => void
}

export function WeeklyScheduleList(
    {
        schedules = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-schedule", "confirm-delete"])
    const form = useWeeklySchedulePostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const weeklySchedules = schedules?.filter(item => item.type === ScheduleType.WEEKLY_SCHEDULE)

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
        const initialValues: WeeklySchedulePost = {
            type: "weekly_schedule",
            name: "",
            description: "",
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-schedule")
    }, [])

    const onDelete = useCallback((item: WeeklyScheduleGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(WEEKLY_SCHEDULE_PARAMS.confirmDeleteItemModalPrompt(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddWeeklyScheduleModal
                {...stack.register("add-schedule")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-schedule")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={WEEKLY_SCHEDULE_PARAMS.confirmDeleteItemModalTitle}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={weeklySchedules}
            getItemPageParams={WEEKLY_SCHEDULE_PARAMS.getItemPageParams}
            href={WEEKLY_SCHEDULE_PARAMS.itemHref}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}