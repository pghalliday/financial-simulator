import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {useRangeSchedulePostFormContext} from "~/forms/schedule/contexts";
import {RANGE_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {RangeSchedulePostForm} from "~/forms/schedule/RangeSchedulePostForm";
import type {RangeSchedulePost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: RangeSchedulePost) => void
    onCancel: () => void
    working: boolean
}

export function AddRangeScheduleModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useRangeSchedulePostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={RANGE_SCHEDULE_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <RangeSchedulePostForm/>
    </AddItemModal>
}