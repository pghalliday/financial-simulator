import type {Route} from "./+types/Scenario";
import {useDisclosure} from "@mantine/hooks";
import {ScenarioProvider} from "~/providers/item_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {EntitiesProvider} from "~/providers/items_providers";
import {SCENARIO_PARAMS} from "~/page_params/scenarios";
import {ScenarioPage} from "~/pages/scenarios/items/ScenarioPage";

export default function Scenario({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loadingScenarios, {open: startLoadingScenarios, close: stopLoadingScenarios}] = useDisclosure()
    const [loadingEntities, {open: startLoadingEntities, close: stopLoadingEntities}] = useDisclosure()
    return <LoadingProvider loading={loadingScenarios || loadingEntities}>
        <ScenarioProvider
            itemId={itemId}
            itemParams={SCENARIO_PARAMS}
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
