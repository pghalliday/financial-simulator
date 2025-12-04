import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {IndividualEntitiesProvider} from "~/providers/typed_items_providers";
import {ScenariosProvider} from "~/providers/items_providers";
import {IndividualEntitiesPage} from "~/pages/entities/collections/IndividualEntitiesPage";

export default function IndividualEntities() {
    const [loadingEntities, {open: startLoadingEntities, close: stopLoadingEntities}] = useDisclosure()
    const [loadingScenarios, {open: startLoadingScenarios, close: stopLoadingScenarios}] = useDisclosure()
    return <LoadingProvider loading={loadingEntities || loadingScenarios}>
        <IndividualEntitiesProvider
            onBegin={startLoadingEntities}
            onEnd={stopLoadingEntities}
        >
            <ScenariosProvider
                onBegin={startLoadingScenarios}
                onEnd={stopLoadingScenarios}
            >
                <IndividualEntitiesPage/>
            </ScenariosProvider>
        </IndividualEntitiesProvider>
    </LoadingProvider>
}
