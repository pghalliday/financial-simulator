import {useDisclosure} from "@mantine/hooks";
import {RateProvidersProvider} from "~/providers/items_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import RateProvidersPage from "~/pages/RateProvidersPage";

export default function RateProviders() {
    const [loadingRates, {open: startLoadingRates, close: stopLoadingRates}] = useDisclosure()
    return <LoadingProvider loading={loadingRates}>
        <RateProvidersProvider
            onBegin={startLoadingRates}
            onEnd={stopLoadingRates}
        >
            <RateProvidersPage/>
        </RateProvidersProvider>
    </LoadingProvider>
}
