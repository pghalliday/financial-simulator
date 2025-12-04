import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {MERGE_DECIMAL_PROVIDER_PARAMS} from "~/page_params/decimal_providers";
import {useMergeDecimalProviderPostFormContext} from "~/forms/decimal_provider/contexts";
import {MergeDecimalProviderPostForm} from "~/forms/decimal_provider/MergeDecimalProviderPostForm";
import type {MergeDecimalProviderPost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: MergeDecimalProviderPost) => void
    onCancel: () => void
    working: boolean
}

export function AddMergeDecimalProviderModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useMergeDecimalProviderPostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={MERGE_DECIMAL_PROVIDER_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <MergeDecimalProviderPostForm/>
    </AddItemModal>
}