import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {MergeRateProvidersPage} from "~/pages/rate_providers/collections/MergeRateProvidersPage";
import {RateProvidersProvider} from "~/providers/items_providers";

export default function MergeRateProviders() {
    const [loadingRateProviders, {open: startLoadingRateProviders, close: stopLoadingRateProviders}] = useDisclosure()
    return <LoadingProvider loading={loadingRateProviders}>
        <RateProvidersProvider
            onBegin={startLoadingRateProviders}
            onEnd={stopLoadingRateProviders}
        >
            <MergeRateProvidersPage/>
        </RateProvidersProvider>
    </LoadingProvider>
}
