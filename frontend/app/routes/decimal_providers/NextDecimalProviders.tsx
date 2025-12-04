import {useDisclosure} from "@mantine/hooks";
import {DecimalProvidersProvider} from "~/providers/items_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {NextDecimalProvidersPage} from "~/pages/decimal_providers/collections/NextDecimalProvidersPage";
import {NextDecimalProvidersProvider} from "~/providers/typed_items_providers";

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
