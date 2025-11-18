import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {RATES_ADD_ITEM_MODAL_TITLE} from "~/strings";
import type {RatePost} from "~/lib/types";
import {RATE_POST_FORM_NAME} from "~/forms/rate/RatePostFormContext";
import {RatePostForm} from "~/forms/rate/RatePostForm";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: RatePost) => void
    onCancel: () => void
    working: boolean
}

export function AddRateModal(
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
        formName={RATE_POST_FORM_NAME}
        working={working}
        title={RATES_ADD_ITEM_MODAL_TITLE}
        onSubmit={onSubmit}
        onCancel={onCancel}
    >
        <RatePostForm allowSelectType/>
    </AddItemModal>
}