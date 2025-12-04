import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {useNextRateProviderPostFormContext} from "~/forms/rate_provider/contexts";
import {NEXT_RATE_PROVIDER_PARAMS} from "~/page_params/rate_providers";
import {NextRateProviderPostForm} from "~/forms/rate_provider/NextRateProviderPostForm";
import type {NextRateProviderPost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: NextRateProviderPost) => void
    onCancel: () => void
    working: boolean
}

export function AddNextRateProviderModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useNextRateProviderPostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={NEXT_RATE_PROVIDER_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <NextRateProviderPostForm/>
    </AddItemModal>
}