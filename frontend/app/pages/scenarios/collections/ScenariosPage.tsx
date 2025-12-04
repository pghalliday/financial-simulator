import {Page} from "~/pages/Page";
import {ScenarioList} from "~/lists/scenarios/ScenarioList";
import {useScenarios} from "~/providers/items_providers";
import {ScenarioPostFormProvider} from "~/forms/scenario/contexts";
import {SCENARIO_PARAMS} from "~/page_params/scenarios";

export function ScenariosPage() {
    const [scenarios, setScenarios] = useScenarios()
    return <Page
        pageParams={{
            title: SCENARIO_PARAMS.collectionPageTitle,
            description: SCENARIO_PARAMS.collectionPageDescription,
            breadcrumbs: SCENARIO_PARAMS.collectionBreadcrumbs,
        }}
    >
        <ScenarioPostFormProvider>
            <ScenarioList scenarios={scenarios} onChange={setScenarios}/>
        </ScenarioPostFormProvider>
    </Page>
}
