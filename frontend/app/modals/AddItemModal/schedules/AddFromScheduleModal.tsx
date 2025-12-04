import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {useFromSchedulePostFormContext} from "~/forms/schedule/contexts";
import {FROM_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {FromSchedulePostForm} from "~/forms/schedule/FromSchedulePostForm";
import type {FromSchedulePost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: FromSchedulePost) => void
    onCancel: () => void
    working: boolean
}

export function AddFromScheduleModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useFromSchedulePostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={FROM_SCHEDULE_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <FromSchedulePostForm/>
    </AddItemModal>
}