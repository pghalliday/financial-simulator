import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {BandedRatesPage} from "~/pages/rates/collections/BandedRatesPage";
import {BandedRatesProvider} from "~/providers/typed_items_providers";

export default function BandedRates() {
    const [loadingRates, {open: startLoadingRates, close: stopLoadingRates}] = useDisclosure()
    return <LoadingProvider loading={loadingRates}>
        <BandedRatesProvider
            onBegin={startLoadingRates}
            onEnd={stopLoadingRates}
        >
            <BandedRatesPage/>
        </BandedRatesProvider>
    </LoadingProvider>
}
