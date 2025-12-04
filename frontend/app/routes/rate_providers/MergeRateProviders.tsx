import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {MergeRateProvidersPage} from "~/pages/rate_providers/collections/MergeRateProvidersPage";
import {MergeRateProvidersProvider, RateProvidersProvider} from "~/providers/items_providers";

export default function MergeRateProviders() {
    const [loadingMergeRateProviders, {
        open: startLoadingMergeRateProviders,
        close: stopLoadingMergeRateProviders,
    }] = useDisclosure()
    const [loadingRateProviders, {open: startLoadingRateProviders, close: stopLoadingRateProviders}] = useDisclosure()
    return <LoadingProvider loading={loadingMergeRateProviders || loadingRateProviders}>
        <MergeRateProvidersProvider
            onBegin={startLoadingMergeRateProviders}
            onEnd={stopLoadingMergeRateProviders}
        >
            <RateProvidersProvider
                onBegin={startLoadingRateProviders}
                onEnd={stopLoadingRateProviders}
            >
                <MergeRateProvidersPage/>
            </RateProvidersProvider>
        </MergeRateProvidersProvider>
    </LoadingProvider>
}
