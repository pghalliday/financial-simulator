import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {BandedRatesPage} from "~/pages/rates/collections/BandedRatesPage";
import {RatesProvider} from "~/providers/items_providers";

export default function BandedRates() {
    const [loadingRates, {open: startLoadingRates, close: stopLoadingRates}] = useDisclosure()
    return <LoadingProvider loading={loadingRates}>
        <RatesProvider
            onBegin={startLoadingRates}
            onEnd={stopLoadingRates}
        >
            <BandedRatesPage/>
        </RatesProvider>
    </LoadingProvider>
}
