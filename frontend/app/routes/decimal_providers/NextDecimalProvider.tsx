import type {Route} from "./+types/NextDecimalProvider";
import {useDisclosure} from "@mantine/hooks";
import {NextDecimalProviderProvider} from "~/providers/item_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {DecimalProvidersProvider} from "~/providers/items_providers";
import {NEXT_DECIMAL_PROVIDER_PARAMS} from "~/page_params/decimal_providers";
import {NextDecimalProviderPage} from "~/pages/decimal_providers/items/NextDecimalProviderPage";

export default function NextDecimalProvider({params}: Route.ComponentProps) {
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
        <NextDecimalProviderProvider
            itemId={itemId}
            itemParams={NEXT_DECIMAL_PROVIDER_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <DecimalProvidersProvider
                onBegin={startLoadingDecimalProviders}
                onEnd={stopLoadingDecimalProviders}
            >
                <NextDecimalProviderPage/>
            </DecimalProvidersProvider>
        </NextDecimalProviderProvider>
    </LoadingProvider>
}
