import {ItemPageForm} from "~/pages/common/ItemPageForm";
import {ScenarioPostForm} from "~/forms/scenario/ScenarioPostForm";
import {SCENARIO_POST_FORM_NAME} from "~/forms/scenario/ScenarioPostFormContext";
import {useScenario} from "~/providers/item_providers";
import {useFormContext} from "~/lib/hooks/useFormContext";

export default function ScenarioPageForms() {
    const form = useFormContext(SCENARIO_POST_FORM_NAME)
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
