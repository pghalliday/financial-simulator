import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {CorporationEntitiesProvider} from "~/providers/typed_items_providers";
import {ScenariosProvider} from "~/providers/items_providers";
import {CorporationEntitiesPage} from "~/pages/entities/collections/CorporationEntitiesPage";

export default function CorporationEntities() {
    const [loadingEntities, {open: startLoadingEntities, close: stopLoadingEntities}] = useDisclosure()
    const [loadingScenarios, {open: startLoadingScenarios, close: stopLoadingScenarios}] = useDisclosure()
    return <LoadingProvider loading={loadingEntities || loadingScenarios}>
        <CorporationEntitiesProvider
            onBegin={startLoadingEntities}
            onEnd={stopLoadingEntities}
        >
            <ScenariosProvider
                onBegin={startLoadingScenarios}
                onEnd={stopLoadingScenarios}
            >
                <CorporationEntitiesPage/>
            </ScenariosProvider>
        </CorporationEntitiesProvider>
    </LoadingProvider>
}
