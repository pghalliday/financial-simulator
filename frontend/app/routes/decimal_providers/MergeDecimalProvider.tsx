import type {Route} from "./+types/MergeDecimalProvider";
import {useDisclosure} from "@mantine/hooks";
import {MergeDecimalProviderProvider} from "~/providers/item_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {DecimalProvidersProvider} from "~/providers/items_providers";
import {MERGE_DECIMAL_PROVIDER_PARAMS} from "~/page_params/decimal_providers";
import {MergeDecimalProviderPage} from "~/pages/decimal_providers/items/MergeDecimalProviderPage";

export default function MergeDecimalProvider({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [loadingDecimalProviders, {
        open: startLoadingDecimalProviders,
        close: stopLoadingDecimalProviders,
    }] = useDisclosure()
    return <LoadingProvider loading={
        loading ||
        loadingDecimalProviders
    }>
        <MergeDecimalProviderProvider
            itemId={itemId}
            itemParams={MERGE_DECIMAL_PROVIDER_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <DecimalProvidersProvider
                onBegin={startLoadingDecimalProviders}
                onEnd={stopLoadingDecimalProviders}
            >
                <MergeDecimalProviderPage/>
            </DecimalProvidersProvider>
        </MergeDecimalProviderProvider>
    </LoadingProvider>
}
