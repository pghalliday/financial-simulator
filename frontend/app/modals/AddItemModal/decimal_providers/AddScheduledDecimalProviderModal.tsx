import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {SCHEDULED_DECIMAL_PROVIDER_PARAMS} from "~/page_params/decimal_providers";
import {useScheduledDecimalProviderPostFormContext} from "~/forms/decimal_provider/contexts";
import {ScheduledDecimalProviderPostForm} from "~/forms/decimal_provider/ScheduledDecimalProviderPostForm";
import type {ScheduledDecimalProviderPost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: ScheduledDecimalProviderPost) => void
    onCancel: () => void
    working: boolean
}

export function AddScheduledDecimalProviderModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useScheduledDecimalProviderPostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={SCHEDULED_DECIMAL_PROVIDER_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <ScheduledDecimalProviderPostForm/>
    </AddItemModal>
}