import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {useDailySchedulePostFormContext} from "~/forms/schedule/contexts";
import {DAILY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {DailySchedulePostForm} from "~/forms/schedule/DailySchedulePostForm";
import type {DailySchedulePost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: DailySchedulePost) => void
    onCancel: () => void
    working: boolean
}

export function AddDailyScheduleModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useDailySchedulePostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={DAILY_SCHEDULE_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <DailySchedulePostForm/>
    </AddItemModal>
}