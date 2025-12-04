import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {usePeriodicRatePostFormContext} from "~/forms/rate/contexts";
import {PERIODIC_RATE_PARAMS} from "~/page_params/rates";
import {PeriodicRatePostForm} from "~/forms/rate/PeriodicRatePostForm";
import type {PeriodicRatePost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: PeriodicRatePost) => void
    onCancel: () => void
    working: boolean
}

export function AddPeriodicRateModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = usePeriodicRatePostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={PERIODIC_RATE_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <PeriodicRatePostForm/>
    </AddItemModal>
}