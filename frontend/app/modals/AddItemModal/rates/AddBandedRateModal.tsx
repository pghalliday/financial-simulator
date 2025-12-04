import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {useBandedRatePostFormContext} from "~/forms/rate/contexts";
import {BANDED_RATE_PARAMS} from "~/page_params/rates";
import {BandedRatePostForm} from "~/forms/rate/BandedRatePostForm";
import type {BandedRatePost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: BandedRatePost) => void
    onCancel: () => void
    working: boolean
}

export function AddBandedRateModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useBandedRatePostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={BANDED_RATE_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <BandedRatePostForm/>
    </AddItemModal>
}