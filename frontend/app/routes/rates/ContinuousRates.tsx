import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {ContinuousRatesPage} from "~/pages/rates/collections/ContinuousRatesPage";
import {ContinuousRatesProvider} from "~/providers/items_providers";

export default function ContinuousRates() {
    const [loadingRates, {open: startLoadingRates, close: stopLoadingRates}] = useDisclosure()
    return <LoadingProvider loading={loadingRates}>
        <ContinuousRatesProvider
            onBegin={startLoadingRates}
            onEnd={stopLoadingRates}
        >
            <ContinuousRatesPage/>
        </ContinuousRatesProvider>
    </LoadingProvider>
}
