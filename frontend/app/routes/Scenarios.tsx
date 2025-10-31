import {useDisclosure} from "@mantine/hooks";
import {EntitiesProvider, ScenariosProvider} from "~/providers/items_providers";
import {ScenariosPage} from "~/pages/ScenariosPage";
import {LoadingProvider} from "~/providers/LoadingProvider";

export default function Scenarios() {
    const [loadingScenario, {open: startLoadingScenario, close: stopLoadingScenario}] = useDisclosure()
    const [loadingEntities, {open: startLoadingEntities, close: stopLoadingEntities}] = useDisclosure()
    return <LoadingProvider loading={loadingScenario || loadingEntities}>
        <ScenariosProvider
            onBegin={startLoadingScenario}
            onEnd={stopLoadingScenario}
        >
            <EntitiesProvider
                onBegin={startLoadingEntities}
                onEnd={stopLoadingEntities}
            >
                <ScenariosPage/>
            </EntitiesProvider>
        </ScenariosProvider>
    </LoadingProvider>
}
