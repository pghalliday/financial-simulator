import {AddItemModal} from "~/modals/AddItemModal/AddItemModal";
import {SCENARIO_POST_FORM_NAME} from "~/forms/scenario/ScenarioPostFormContext";
import {ScenarioPostForm} from "~/forms/scenario/ScenarioPostForm";
import type {ScenarioPost} from "../../../client";
import {SCENARIOS_ADD_ITEM_MODAL_TITLE} from "~/strings";

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
    return <AddItemModal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        formName={SCENARIO_POST_FORM_NAME}
        working={working}
        title={SCENARIOS_ADD_ITEM_MODAL_TITLE}
        onSubmit={onSubmit}
        onCancel={onCancel}
    >
        <ScenarioPostForm/>
    </AddItemModal>
}