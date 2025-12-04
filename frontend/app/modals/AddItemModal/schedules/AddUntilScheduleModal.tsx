import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {useUntilSchedulePostFormContext} from "~/forms/schedule/contexts";
import {UNTIL_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {UntilSchedulePostForm} from "~/forms/schedule/UntilSchedulePostForm";
import type {UntilSchedulePost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: UntilSchedulePost) => void
    onCancel: () => void
    working: boolean
}

export function AddUntilScheduleModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useUntilSchedulePostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={UNTIL_SCHEDULE_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <UntilSchedulePostForm/>
    </AddItemModal>
}