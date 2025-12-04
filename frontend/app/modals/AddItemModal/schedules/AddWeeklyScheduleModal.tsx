import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {useWeeklySchedulePostFormContext} from "~/forms/schedule/contexts";
import {WEEKLY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {WeeklySchedulePostForm} from "~/forms/schedule/WeeklySchedulePostForm";
import type {WeeklySchedulePost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: WeeklySchedulePost) => void
    onCancel: () => void
    working: boolean
}

export function AddWeeklyScheduleModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useWeeklySchedulePostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={WEEKLY_SCHEDULE_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <WeeklySchedulePostForm/>
    </AddItemModal>
}