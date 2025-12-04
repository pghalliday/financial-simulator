import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {useCorporationEntityPostFormContext} from "~/forms/entity/contexts";
import {CORPORATION_ENTITY_PARAMS} from "~/page_params/entities";
import {CorporationEntityPostForm} from "~/forms/entity/CorporationEntityPostForm";
import type {CorporationEntityPost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: CorporationEntityPost) => void
    onCancel: () => void
    working: boolean
}

export function AddCorporationEntityModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useCorporationEntityPostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={CORPORATION_ENTITY_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <CorporationEntityPostForm/>
    </AddItemModal>
}