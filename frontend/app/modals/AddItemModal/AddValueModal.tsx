import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {VALUES_ADD_ITEM_MODAL_TITLE} from "~/strings";
import type {ValuePost} from "~/lib/types";
import {VALUE_POST_FORM_NAME} from "~/forms/value/ValuePostFormContext";
import {ValuePostForm} from "~/forms/value/ValuePostForm";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: ValuePost) => void
    onCancel: () => void
    working: boolean
}

export function AddValueModal(
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
        formName={VALUE_POST_FORM_NAME}
        working={working}
        title={VALUES_ADD_ITEM_MODAL_TITLE}
        onSubmit={onSubmit}
        onCancel={onCancel}
    >
        <ValuePostForm allowSelectType/>
    </AddItemModal>
}