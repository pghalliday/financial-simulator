import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {useMergeRateProviderPostFormContext} from "~/forms/rate_provider/contexts";
import {MERGE_RATE_PROVIDER_PARAMS} from "~/page_params/rate_providers";
import {MergeRateProviderPostForm} from "~/forms/rate_provider/MergeRateProviderPostForm";
import type {MergeRateProviderPost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: MergeRateProviderPost) => void
    onCancel: () => void
    working: boolean
}

export function AddMergeRateProviderModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useMergeRateProviderPostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={MERGE_RATE_PROVIDER_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <MergeRateProviderPostForm/>
    </AddItemModal>
}