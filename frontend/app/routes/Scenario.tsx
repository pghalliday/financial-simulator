import type {Route} from "./+types/Scenario";
import {useDisclosure} from "@mantine/hooks";
import {ScenarioProvider} from "~/providers/item_providers";
import ScenarioPage from "~/pages/ScenarioPage/ScenarioPage";
import type {ScenarioGet} from "~/client";
import type {ItemPageParams} from "~/lib/hooks/useItemPageParams";
import {SCENARIO_BREADCRUMBS, SCENARIO_PAGE_DESCRIPTION, SCENARIO_PAGE_TITLE} from "~/strings";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {EntitiesProvider} from "~/providers/items_providers";

export function getScenarioPageParams(item: ScenarioGet): ItemPageParams {
    return {
        id: item.id,
        name: item.name,
    }
}

export default function Scenario({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loadingScenarios, {open: startLoadingScenarios, close: stopLoadingScenarios}] = useDisclosure()
    const [loadingEntities, {open: startLoadingEntities, close: stopLoadingEntities}] = useDisclosure()
    return <LoadingProvider loading={loadingScenarios || loadingEntities}>
        <ScenarioProvider
            itemId={itemId}
            itemPageTitle={SCENARIO_PAGE_TITLE}
            itemPageDescription={SCENARIO_PAGE_DESCRIPTION}
            itemBreadcrumbs={SCENARIO_BREADCRUMBS}
            getItemPageParams={getScenarioPageParams}
            onBegin={startLoadingScenarios}
            onEnd={stopLoadingScenarios}
        >
            <EntitiesProvider
                onBegin={startLoadingEntities}
                onEnd={stopLoadingEntities}
            >
                <ScenarioPage/>
            </EntitiesProvider>
        </ScenarioProvider>
    </LoadingProvider>
}
