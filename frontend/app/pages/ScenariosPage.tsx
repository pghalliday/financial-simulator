import {Page} from "~/pages/common/Page";
import {SCENARIOS_BREADCRUMBS, SCENARIOS_PAGE_DESCRIPTION, SCENARIOS_PAGE_TITLE} from "~/strings";
import {ScenarioList} from "~/lists/ScenarioList";
import {useScenarios} from "~/providers/items_providers";
import {ScenarioPostFormProvider} from "~/forms/scenario/ScenarioPostFormContext";
import {useLoading} from "~/providers/LoadingProvider";

export function ScenariosPage() {
    const loading = useLoading()
    const [scenarios, setScenarios] = useScenarios()
    return <Page
        pageParams={{
            title: SCENARIOS_PAGE_TITLE,
            description: SCENARIOS_PAGE_DESCRIPTION,
            breadcrumbs: SCENARIOS_BREADCRUMBS,
        }}
        loading={loading}
    >
        <ScenarioPostFormProvider>
            <ScenarioList scenarios={scenarios} onChange={setScenarios}/>
        </ScenarioPostFormProvider>
    </Page>
}
