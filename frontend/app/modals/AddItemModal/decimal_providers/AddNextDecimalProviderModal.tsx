import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {NEXT_DECIMAL_PROVIDER_PARAMS} from "~/page_params/decimal_providers";
import {useNextDecimalProviderPostFormContext} from "~/forms/decimal_provider/contexts";
import {NextDecimalProviderPostForm} from "~/forms/decimal_provider/NextDecimalProviderPostForm";
import type {NextDecimalProviderPost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: NextDecimalProviderPost) => void
    onCancel: () => void
    working: boolean
}

export function AddNextDecimalProviderModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useNextDecimalProviderPostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={NEXT_DECIMAL_PROVIDER_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <NextDecimalProviderPostForm/>
    </AddItemModal>
}