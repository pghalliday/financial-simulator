import {useDisclosure} from "@mantine/hooks";
import {DecimalProvidersProvider, NextDecimalProvidersProvider} from "~/providers/items_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {NextDecimalProvidersPage} from "~/pages/decimal_providers/collections/NextDecimalProvidersPage";

export default function NextDecimalProviders() {
    const [loadingNextDecimalProviders, {
        open: startLoadingNextDecimalProviders,
        close: stopLoadingNextDecimalProviders,
    }] = useDisclosure()
    const [loadingDecimalProviders, {
        open: startLoadingDecimalProviders,
        close: stopLoadingDecimalProviders,
    }] = useDisclosure()
    return <LoadingProvider loading={loadingNextDecimalProviders || loadingDecimalProviders}>
        <NextDecimalProvidersProvider
            onBegin={startLoadingNextDecimalProviders}
            onEnd={stopLoadingNextDecimalProviders}
        >
            <DecimalProvidersProvider
                onBegin={startLoadingDecimalProviders}
                onEnd={stopLoadingDecimalProviders}
            >
                <NextDecimalProvidersPage/>
            </DecimalProvidersProvider>
        </NextDecimalProvidersProvider>
    </LoadingProvider>
}
