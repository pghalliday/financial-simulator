import {Page} from "~/pages/Page";
import {ScenarioPostFormProvider} from "~/forms/scenario/contexts";
import {useScenario} from "~/providers/item_providers";
import {ScenarioPageForms} from "~/pages/scenarios/forms/ScenarioPageForms";

export function ScenarioPage() {
    const [scenario, _putScenario, pageParams] = useScenario({})

    return <Page
        pageParams={pageParams}
    >
        <ScenarioPostFormProvider
            key={scenario?.id}
            initialValues={scenario}
        >
            <ScenarioPageForms/>
        </ScenarioPostFormProvider>
    </Page>
}
