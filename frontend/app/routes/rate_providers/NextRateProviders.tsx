import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {NextRateProvidersPage} from "~/pages/rate_providers/collections/NextRateProvidersPage";
import {RateProvidersProvider} from "~/providers/items_providers";

export default function NextRateProviders() {
    const [loadingRateProviders, {open: startLoadingRateProviders, close: stopLoadingRateProviders}] = useDisclosure()
    return <LoadingProvider loading={loadingRateProviders}>
        <RateProvidersProvider
            onBegin={startLoadingRateProviders}
            onEnd={stopLoadingRateProviders}
        >
            <NextRateProvidersPage/>
        </RateProvidersProvider>
    </LoadingProvider>
}
