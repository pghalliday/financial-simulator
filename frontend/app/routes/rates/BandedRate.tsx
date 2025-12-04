import type {Route} from "./+types/BandedRate";
import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {BandedRateProvider} from "~/providers/item_providers";
import {BANDED_RATE_PARAMS} from "~/page_params/rates";
import {BandedRatePage} from "~/pages/rates/items/BandedRatePage";

export default function BandedRate({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <BandedRateProvider
            itemId={itemId}
            itemParams={BANDED_RATE_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <BandedRatePage/>
        </BandedRateProvider>
    </LoadingProvider>
}
