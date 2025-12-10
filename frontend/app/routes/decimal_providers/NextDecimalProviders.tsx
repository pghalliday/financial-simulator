import {useDisclosure} from "@mantine/hooks";
import {DecimalProvidersProvider} from "~/providers/items_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {NextDecimalProvidersPage} from "~/pages/decimal_providers/collections/NextDecimalProvidersPage";

export default function NextDecimalProviders() {
    const [loadingDecimalProviders, {
        open: startLoadingDecimalProviders,
        close: stopLoadingDecimalProviders,
    }] = useDisclosure()
    return <LoadingProvider loading={loadingDecimalProviders}>
        <DecimalProvidersProvider
            onBegin={startLoadingDecimalProviders}
            onEnd={stopLoadingDecimalProviders}
        >
            <NextDecimalProvidersPage/>
        </DecimalProvidersProvider>
    </LoadingProvider>
}
