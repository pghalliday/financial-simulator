import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {PeriodicRatesPage} from "~/pages/rates/collections/PeriodicRatesPage";
import {PeriodicRatesProvider} from "~/providers/items_providers";

export default function PeriodicRates() {
    const [loadingRates, {open: startLoadingRates, close: stopLoadingRates}] = useDisclosure()
    return <LoadingProvider loading={loadingRates}>
        <PeriodicRatesProvider
            onBegin={startLoadingRates}
            onEnd={stopLoadingRates}
        >
            <PeriodicRatesPage/>
        </PeriodicRatesProvider>
    </LoadingProvider>
}
