import {useDisclosure} from "@mantine/hooks";
import {DecimalProvidersProvider} from "~/providers/items_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import DecimalProvidersPage from "~/pages/DecimalProvidersPage";

export default function DecimalProviders() {
    const [loadingRates, {open: startLoadingRates, close: stopLoadingRates}] = useDisclosure()
    return <LoadingProvider loading={loadingRates}>
        <DecimalProvidersProvider
            onBegin={startLoadingRates}
            onEnd={stopLoadingRates}
        >
            <DecimalProvidersPage/>
        </DecimalProvidersProvider>
    </LoadingProvider>
}
