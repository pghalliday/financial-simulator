import {
    SCHEDULE_HREF,
    SCHEDULE_TYPES,
    SCHEDULES_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    SCHEDULES_CONFIRM_DELETE_ITEM_MODAL_TITLE
} from "~/strings";
import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {type DailySchedulePost, deleteItemRouteSchedulesItemIdDelete, postItemRouteSchedulesPost} from "../../client";
import type {ScheduleGet, SchedulePost} from "~/lib/types";
import {type ReactElement, useCallback, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {useListPost} from "~/lib/hooks/useListPost";
import {ConfirmDeleteModal} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {useListDelete} from "~/lib/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {useSchedulePostFormContext} from "~/forms/schedule/SchedulePostFormContext";
import {AddScheduleModal} from "~/modals/AddItemModal/AddScheduleModal";
import {getSchedulePageParams} from "~/routes/Schedule";

const NAME_COLUMN: Column<ScheduleGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const TYPE_COLUMN: Column<ScheduleGet> = {
    heading: "Type",
    hasLink: false,
    compare: (a, b) => SCHEDULE_TYPES[a.type].localeCompare(SCHEDULE_TYPES[b.type]),
    render: (item) => SCHEDULE_TYPES[item.type],
}

const DESCRIPTION_COLUMN: Column<ScheduleGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
}

const COLUMNS = [NAME_COLUMN, TYPE_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<ScheduleGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: TYPE_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<ScheduleGet>[] = ["name", "description"]

export interface Props {
    schedules?: ScheduleGet[]
    onChange?: (items: ScheduleGet[]) => void
}

export function ScheduleList(
    {
        schedules = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-schedule", "confirm-delete"])
    const form = useSchedulePostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

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

    const {setToDelete, deleteItem} = useListDelete<SchedulePost, ScheduleGet>({
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
        const initialValues: DailySchedulePost = {
            type: "daily_schedule",
            name: "",
            description: "",
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-schedule")
    }, [])

    const onDelete = useCallback((item: ScheduleGet) => {
        setToDelete(item)
        setConfirmDeletePrompt(SCHEDULES_CONFIRM_DELETE_ITEM_MODAL_PROMPT(item))
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddScheduleModal
                {...stack.register("add-schedule")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-schedule")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={SCHEDULES_CONFIRM_DELETE_ITEM_MODAL_TITLE}
                prompt={confirmDeletePrompt}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={schedules}
            getItemPageParams={getSchedulePageParams}
            href={SCHEDULE_HREF}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}