import type {Route} from "./+types/NextRateProvider";
import {useDisclosure} from "@mantine/hooks";
import {NextRateProviderProvider} from "~/providers/item_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {NEXT_RATE_PROVIDER_PARAMS} from "~/page_params/rate_providers";
import {NextRateProviderPage} from "~/pages/rate_providers/items/NextRateProviderPage";
import {RateProvidersProvider} from "~/providers/items_providers";

export default function NextRateProvider({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [loadingRateProviders, {open: startLoadingRateProviders, close: stopLoadingRateProviders}] = useDisclosure()
    return <LoadingProvider loading={loading || loadingRateProviders}>
        <NextRateProviderProvider
            itemId={itemId}
            itemParams={NEXT_RATE_PROVIDER_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <RateProvidersProvider
                onBegin={startLoadingRateProviders}
                onEnd={stopLoadingRateProviders}
            >
                <NextRateProviderPage/>
            </RateProvidersProvider>
        </NextRateProviderProvider>
    </LoadingProvider>
}
