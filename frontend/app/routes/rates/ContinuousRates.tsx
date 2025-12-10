import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {ContinuousRatesPage} from "~/pages/rates/collections/ContinuousRatesPage";
import {RatesProvider} from "~/providers/items_providers";

export default function ContinuousRates() {
    const [loadingRates, {open: startLoadingRates, close: stopLoadingRates}] = useDisclosure()
    return <LoadingProvider loading={loadingRates}>
        <RatesProvider
            onBegin={startLoadingRates}
            onEnd={stopLoadingRates}
        >
            <ContinuousRatesPage/>
        </RatesProvider>
    </LoadingProvider>
}
