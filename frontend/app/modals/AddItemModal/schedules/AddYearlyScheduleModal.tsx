import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {useYearlySchedulePostFormContext} from "~/forms/schedule/contexts";
import {YEARLY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {YearlySchedulePostForm} from "~/forms/schedule/YearlySchedulePostForm";
import type {YearlySchedulePost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: YearlySchedulePost) => void
    onCancel: () => void
    working: boolean
}

export function AddYearlyScheduleModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useYearlySchedulePostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={YEARLY_SCHEDULE_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <YearlySchedulePostForm/>
    </AddItemModal>
}