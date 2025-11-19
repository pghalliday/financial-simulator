import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {SCHEDULES_ADD_ITEM_MODAL_TITLE} from "~/strings";
import type {SchedulePost} from "~/lib/types";
import {SCHEDULE_POST_FORM_NAME} from "~/forms/schedule/SchedulePostFormContext";
import {SchedulePostForm} from "~/forms/schedule/SchedulePostForm";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: SchedulePost) => void
    onCancel: () => void
    working: boolean
}

export function AddScheduleModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        formName={SCHEDULE_POST_FORM_NAME}
        working={working}
        title={SCHEDULES_ADD_ITEM_MODAL_TITLE}
        onSubmit={onSubmit}
        onCancel={onCancel}
    >
        <SchedulePostForm allowSelectType/>
    </AddItemModal>
}