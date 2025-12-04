import {useDisclosure} from "@mantine/hooks";
import {DecimalProvidersProvider, MergeDecimalProvidersProvider} from "~/providers/items_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {MergeDecimalProvidersPage} from "~/pages/decimal_providers/collections/MergeDecimalProvidersPage";

export default function MergeDecimalProviders() {
    const [loadingMergeDecimalProviders, {
        open: startLoadingMergeDecimalProviders,
        close: stopLoadingMergeDecimalProviders,
    }] = useDisclosure()
    const [loadingDecimalProviders, {
        open: startLoadingDecimalProviders,
        close: stopLoadingDecimalProviders,
    }] = useDisclosure()
    return <LoadingProvider loading={loadingMergeDecimalProviders || loadingDecimalProviders}>
        <MergeDecimalProvidersProvider
            onBegin={startLoadingMergeDecimalProviders}
            onEnd={stopLoadingMergeDecimalProviders}
        >
            <DecimalProvidersProvider
                onBegin={startLoadingDecimalProviders}
                onEnd={stopLoadingDecimalProviders}
            >
                <MergeDecimalProvidersPage/>
            </DecimalProvidersProvider>
        </MergeDecimalProvidersProvider>
    </LoadingProvider>
}
