import type {Route} from "./+types/MergeRateProvider";
import {useDisclosure} from "@mantine/hooks";
import {MergeRateProviderProvider} from "~/providers/item_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {MERGE_RATE_PROVIDER_PARAMS} from "~/page_params/rate_providers";
import {MergeRateProviderPage} from "~/pages/rate_providers/items/MergeRateProviderPage";
import {RateProvidersProvider} from "~/providers/items_providers";

export default function MergeRateProvider({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [loadingRateProviders, {open: startLoadingRateProviders, close: stopLoadingRateProviders}] = useDisclosure()
    return <LoadingProvider loading={loading || loadingRateProviders}>
        <MergeRateProviderProvider
            itemId={itemId}
            itemParams={MERGE_RATE_PROVIDER_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <RateProvidersProvider
                onBegin={startLoadingRateProviders}
                onEnd={stopLoadingRateProviders}
            >
                <MergeRateProviderPage/>
            </RateProvidersProvider>
        </MergeRateProviderProvider>
    </LoadingProvider>
}
