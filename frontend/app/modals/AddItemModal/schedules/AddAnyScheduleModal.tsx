import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {useAnySchedulePostFormContext} from "~/forms/schedule/contexts";
import {ANY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {AnySchedulePostForm} from "~/forms/schedule/AnySchedulePostForm";
import type {AnySchedulePost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: AnySchedulePost) => void
    onCancel: () => void
    working: boolean
}

export function AddAnyScheduleModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useAnySchedulePostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={ANY_SCHEDULE_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <AnySchedulePostForm/>
    </AddItemModal>
}