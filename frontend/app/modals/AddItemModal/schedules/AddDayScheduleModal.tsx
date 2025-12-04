import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {useDaySchedulePostFormContext} from "~/forms/schedule/contexts";
import {DAY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {DaySchedulePostForm} from "~/forms/schedule/DaySchedulePostForm";
import type {DaySchedulePost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: DaySchedulePost) => void
    onCancel: () => void
    working: boolean
}

export function AddDayScheduleModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useDaySchedulePostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={DAY_SCHEDULE_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <DaySchedulePostForm/>
    </AddItemModal>
}