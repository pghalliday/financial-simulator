import {ItemPageForm} from "~/pages/ItemPageForm";
import {ScenarioPostForm} from "~/forms/scenario/ScenarioPostForm";
import {useScenarioPostFormContext} from "~/forms/scenario/contexts";
import {useScenario} from "~/providers/item_providers";

export function ScenarioPageForms() {
    const form = useScenarioPostFormContext()
    const [_scenario, putScenario] = useScenario({
        onPutSuccess: scenario => {
            form.setInitialValues(scenario)
        }
    })

    return <ItemPageForm
        onSubmit={form.onSubmit(putScenario)}
        onReset={form.onReset}
    >
        <ScenarioPostForm/>
    </ItemPageForm>
}
