import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {useScheduledRateProviderPostFormContext} from "~/forms/rate_provider/contexts";
import {SCHEDULED_RATE_PROVIDER_PARAMS} from "~/page_params/rate_providers";
import {ScheduledRateProviderPostForm} from "~/forms/rate_provider/ScheduledRateProviderPostForm";
import type {ScheduledRateProviderPost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: ScheduledRateProviderPost) => void
    onCancel: () => void
    working: boolean
}

export function AddScheduledRateProviderModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useScheduledRateProviderPostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={SCHEDULED_RATE_PROVIDER_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <ScheduledRateProviderPostForm/>
    </AddItemModal>
}