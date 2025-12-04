import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {useAllSchedulePostFormContext} from "~/forms/schedule/contexts";
import {ALL_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {AllSchedulePostForm} from "~/forms/schedule/AllSchedulePostForm";
import type {AllSchedulePost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: AllSchedulePost) => void
    onCancel: () => void
    working: boolean
}

export function AddAllScheduleModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useAllSchedulePostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={ALL_SCHEDULE_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <AllSchedulePostForm/>
    </AddItemModal>
}