import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import type {RateProviderPost} from "~/lib/types";
import {RATE_PROVIDER_POST_FORM_NAME} from "~/forms/rate_provider/RateProviderPostFormContext";
import {RATE_PROVIDERS_ADD_ITEM_MODAL_TITLE} from "~/strings";
import {RateProviderPostForm} from "~/forms/rate_provider/RateProviderPostForm";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: RateProviderPost) => void
    onCancel: () => void
    working: boolean
}

export function AddRateProviderModal(
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
        formName={RATE_PROVIDER_POST_FORM_NAME}
        working={working}
        title={RATE_PROVIDERS_ADD_ITEM_MODAL_TITLE}
        onSubmit={onSubmit}
        onCancel={onCancel}
    >
        <RateProviderPostForm allowSelectType/>
    </AddItemModal>
}