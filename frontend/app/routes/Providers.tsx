import {useDisclosure} from "@mantine/hooks";
import {ProvidersProvider} from "~/providers/items_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import ProvidersPage from "~/pages/ProvidersPage";

export default function Providers() {
    const [loadingRates, {open: startLoadingRates, close: stopLoadingRates}] = useDisclosure()
    return <LoadingProvider loading={loadingRates}>
        <ProvidersProvider
            onBegin={startLoadingRates}
            onEnd={stopLoadingRates}
        >
            <ProvidersPage/>
        </ProvidersProvider>
    </LoadingProvider>
}
