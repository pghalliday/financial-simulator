import type {Route} from "./+types/BandedRate";
import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {BandedRateProvider} from "~/providers/item_providers";
import {BANDED_RATE_PARAMS} from "~/page_params/rates";
import {BandedRatePage} from "~/pages/rates/items/BandedRatePage";
import {RatesProvider} from "~/providers/items_providers";

export default function BandedRate({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [loadingRates, {open: startLoadingRates, close: stopLoadingRates}] = useDisclosure()
    return <LoadingProvider loading={loading || loadingRates}>
        <BandedRateProvider
            itemId={itemId}
            itemParams={BANDED_RATE_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <RatesProvider
                onBegin={startLoadingRates}
                onEnd={stopLoadingRates}
            >
                <BandedRatePage/>
            </RatesProvider>
        </BandedRateProvider>
    </LoadingProvider>
}
