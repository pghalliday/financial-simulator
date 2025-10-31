import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {ENTITIES_ADD_ITEM_MODAL_TITLE} from "~/strings";
import {ENTITY_POST_FORM_NAME} from "~/forms/entity/EntityPostFormContext";
import {EntityPostForm} from "~/forms/entity/EntityPostForm";
import type {EntityPost} from "~/lib/types";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: EntityPost) => void
    onCancel: () => void
    working: boolean
}

export function AddEntityModal(
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
        formName={ENTITY_POST_FORM_NAME}
        working={working}
        title={ENTITIES_ADD_ITEM_MODAL_TITLE}
        onSubmit={onSubmit}
        onCancel={onCancel}
    >
        <EntityPostForm allowSelectType/>
    </AddItemModal>
}