import {ItemPageForm} from "~/pages/common/ItemPageForm";
import {ScenarioPostForm} from "~/forms/scenario/ScenarioPostForm";
import {SCENARIO_POST_FORM_NAME, useScenarioPostFormContext} from "~/forms/scenario/ScenarioPostFormContext";
import {useScenario} from "~/providers/item_providers";

export default function ScenarioPageForms() {
    const form = useScenarioPostFormContext()
    const [_scenario, putScenario] = useScenario({
        onPutSuccess: scenario => {
            form.setInitialValues(scenario)
        }
    })

    return <ItemPageForm
        formName={SCENARIO_POST_FORM_NAME}
        onSubmit={putScenario}
    >
        <ScenarioPostForm/>
    </ItemPageForm>
}
