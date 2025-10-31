import {useDisclosure} from "@mantine/hooks";
import {EntitiesProvider, ScenariosProvider} from "~/providers/items_providers";
import EntitiesPage from "~/pages/EntitiesPage";
import {LoadingProvider} from "~/providers/LoadingProvider";

export default function Entities() {
    const [loadingEntities, {open: startLoadingEntities, close: stopLoadingEntities}] = useDisclosure()
    const [loadingScenarios, {open: startLoadingScenarios, close: stopLoadingScenarios}] = useDisclosure()
    return <LoadingProvider loading={loadingEntities || loadingScenarios}>
        <EntitiesProvider
            onBegin={startLoadingEntities}
            onEnd={stopLoadingEntities}
        >
            <ScenariosProvider
                onBegin={startLoadingScenarios}
                onEnd={stopLoadingScenarios}
            >
                <EntitiesPage/>
            </ScenariosProvider>
        </EntitiesProvider>
    </LoadingProvider>
}
