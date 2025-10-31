import {Page} from "~/pages/common/Page";
import {ScenarioPostFormProvider} from "~/forms/scenario/ScenarioPostFormContext";
import {useScenario} from "~/providers/item_providers";
import ScenarioPageForms from "~/pages/ScenarioPage/ScenarioPageForms";

export default function ScenarioPage() {
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
