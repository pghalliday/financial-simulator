import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {
    deleteItemRouteSchedulesItemIdDelete,
    postItemRouteSchedulesPost,
    type RangeScheduleGet,
    type RangeSchedulePost,
    ScheduleType
} from "../../../client";
import type {ScheduleGet, SchedulePost} from "~/lib/types";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {useListDelete} from "~/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {AddRangeScheduleModal} from "~/modals/AddItemModal/schedules/AddRangeScheduleModal";
import {useRangeSchedulePostFormContext} from "~/forms/schedule/contexts";
import {RANGE_SCHEDULE_PARAMS} from "~/page_params/schedules";

const NAME_COLUMN: Column<RangeScheduleGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const DESCRIPTION_COLUMN: Column<RangeScheduleGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<RangeScheduleGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<RangeScheduleGet>[] = ["name", "description"]

export interface Props {
    schedules?: ScheduleGet[]
    onChange?: (items: ScheduleGet[]) => void
}

export function RangeScheduleList(
    {
        schedules = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-schedule", "confirm-delete"])
    const form = useRangeSchedulePostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const rangeSchedules = schedules?.filter(item => item.type === ScheduleType.RANGE_SCHEDULE)

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
        const initialValues: RangeSchedulePost = {
            type: "range_schedule",
            name: "",
            description: "",
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-schedule")
    }, [])

    const onDelete = useCallback((item: RangeScheduleGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(RANGE_SCHEDULE_PARAMS.confirmDeleteItemModalPrompt(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddRangeScheduleModal
                {...stack.register("add-schedule")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-schedule")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={RANGE_SCHEDULE_PARAMS.confirmDeleteItemModalTitle}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={rangeSchedules}
            getItemPageParams={RANGE_SCHEDULE_PARAMS.getItemPageParams}
            href={RANGE_SCHEDULE_PARAMS.itemHref}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}