import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {useMonthlySchedulePostFormContext} from "~/forms/schedule/contexts";
import {MONTHLY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {MonthlySchedulePostForm} from "~/forms/schedule/MonthlySchedulePostForm";
import type {MonthlySchedulePost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: MonthlySchedulePost) => void
    onCancel: () => void
    working: boolean
}

export function AddMonthlyScheduleModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useMonthlySchedulePostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={MONTHLY_SCHEDULE_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <MonthlySchedulePostForm/>
    </AddItemModal>
}