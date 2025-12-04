import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {ScenarioPostForm} from "~/forms/scenario/ScenarioPostForm";
import type {ScenarioPost} from "../../../../client";
import {SCENARIO_PARAMS} from "~/page_params/scenarios";
import {useScenarioPostFormContext} from "~/forms/scenario/contexts";

interface Props {
    opened: boolean
    onClose: () => void,
    stackId: string,
    onSubmit: (post: ScenarioPost) => void
    onCancel: () => void
    working: boolean
}

export function AddScenarioModal(
    {
        opened,
        onClose,
        stackId,
        onSubmit,
        onCancel,
        working
    }: Props
) {
    const form = useScenarioPostFormContext()
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        working={working}
        title={SCENARIO_PARAMS.addItemModalTitle}
        onSubmit={form.onSubmit(onSubmit)}
        onCancel={onCancel}
    >
        <ScenarioPostForm/>
    </AddItemModal>
}