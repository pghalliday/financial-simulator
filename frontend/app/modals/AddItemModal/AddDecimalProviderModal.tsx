import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import type {DecimalProviderPost} from "~/lib/types";
import {DECIMAL_PROVIDER_POST_FORM_NAME} from "~/forms/decimal_provider/DecimalProviderPostFormContext";
import {DECIMAL_PROVIDERS_ADD_ITEM_MODAL_TITLE} from "~/strings";
import {DecimalProviderPostForm} from "~/forms/decimal_provider/DecimalProviderPostForm";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: DecimalProviderPost) => void
    onCancel: () => void
    working: boolean
}

export function AddDecimalProviderModal(
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
        formName={DECIMAL_PROVIDER_POST_FORM_NAME}
        working={working}
        title={DECIMAL_PROVIDERS_ADD_ITEM_MODAL_TITLE}
        onSubmit={onSubmit}
        onCancel={onCancel}
    >
        <DecimalProviderPostForm allowSelectType/>
    </AddItemModal>
}