import {useDisclosure} from "@mantine/hooks";
import {DecimalProvidersProvider} from "~/providers/items_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {MergeDecimalProvidersPage} from "~/pages/decimal_providers/collections/MergeDecimalProvidersPage";

export default function MergeDecimalProviders() {
    const [loadingDecimalProviders, {
        open: startLoadingDecimalProviders,
        close: stopLoadingDecimalProviders,
    }] = useDisclosure()
    return <LoadingProvider loading={loadingDecimalProviders}>
        <DecimalProvidersProvider
            onBegin={startLoadingDecimalProviders}
            onEnd={stopLoadingDecimalProviders}
        >
            <MergeDecimalProvidersPage/>
        </DecimalProvidersProvider>
    </LoadingProvider>
}
