import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {PROVIDERS_ADD_ITEM_MODAL_TITLE} from "~/strings";
import type {ProviderPost} from "~/lib/types";
import {PROVIDER_POST_FORM_NAME} from "~/forms/provider/ProviderPostFormContext";
import {ProviderPostForm} from "~/forms/provider/ProviderPostForm";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: ProviderPost) => void
    onCancel: () => void
    working: boolean
}

export function AddProviderModal(
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
        formName={PROVIDER_POST_FORM_NAME}
        working={working}
        title={PROVIDERS_ADD_ITEM_MODAL_TITLE}
        onSubmit={onSubmit}
        onCancel={onCancel}
    >
        <ProviderPostForm allowSelectType/>
    </AddItemModal>
}