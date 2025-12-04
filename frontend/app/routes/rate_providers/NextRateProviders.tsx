import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {NextRateProvidersPage} from "~/pages/rate_providers/collections/NextRateProvidersPage";
import {NextRateProvidersProvider} from "~/providers/typed_items_providers";
import {RateProvidersProvider} from "~/providers/items_providers";

export default function NextRateProviders() {
    const [loadingNextRateProviders, {
        open: startLoadingNextRateProviders,
        close: stopLoadingNextRateProviders,
    }] = useDisclosure()
    const [loadingRateProviders, {open: startLoadingRateProviders, close: stopLoadingRateProviders}] = useDisclosure()
    return <LoadingProvider loading={loadingNextRateProviders || loadingRateProviders}>
        <NextRateProvidersProvider
            onBegin={startLoadingNextRateProviders}
            onEnd={stopLoadingNextRateProviders}
        >
            <RateProvidersProvider
                onBegin={startLoadingRateProviders}
                onEnd={stopLoadingRateProviders}
            >
                <NextRateProvidersPage/>
            </RateProvidersProvider>
        </NextRateProvidersProvider>
    </LoadingProvider>
}
