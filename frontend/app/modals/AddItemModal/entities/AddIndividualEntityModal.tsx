import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {useIndividualEntityPostFormContext} from "~/forms/entity/contexts";
import {INDIVIDUAL_ENTITY_PARAMS} from "~/page_params/entities";
import {IndividualEntityPostForm} from "~/forms/entity/IndividualEntityPostForm";
import type {IndividualEntityPost} from "../../../../client";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: IndividualEntityPost) => void
    onCancel: () => void
    working: boolean
}

export function AddIndividualEntityModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useIndividualEntityPostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={INDIVIDUAL_ENTITY_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <IndividualEntityPostForm/>
    </AddItemModal>
}