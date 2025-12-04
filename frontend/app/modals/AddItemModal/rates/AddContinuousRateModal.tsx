import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {useContinuousRatePostFormContext} from "~/forms/rate/contexts";
import {CONTINUOUS_RATE_PARAMS} from "~/page_params/rates";
import {ContinuousRatePostForm} from "~/forms/rate/ContinuousRatePostForm";
import type {ContinuousRatePost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: ContinuousRatePost) => void
    onCancel: () => void
    working: boolean
}

export function AddContinuousRateModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useContinuousRatePostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={CONTINUOUS_RATE_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <ContinuousRatePostForm/>
    </AddItemModal>
}