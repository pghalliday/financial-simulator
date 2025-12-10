import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {PeriodicRatesPage} from "~/pages/rates/collections/PeriodicRatesPage";
import {RatesProvider} from "~/providers/items_providers";

export default function PeriodicRates() {
    const [loadingRates, {open: startLoadingRates, close: stopLoadingRates}] = useDisclosure()
    return <LoadingProvider loading={loadingRates}>
        <RatesProvider
            onBegin={startLoadingRates}
            onEnd={stopLoadingRates}
        >
            <PeriodicRatesPage/>
        </RatesProvider>
    </LoadingProvider>
}
