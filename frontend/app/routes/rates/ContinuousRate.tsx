import type {Route} from "./+types/ContinuousRate";
import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {ContinuousRateProvider} from "~/providers/item_providers";
import {CONTINUOUS_RATE_PARAMS} from "~/page_params/rates";
import {ContinuousRatePage} from "~/pages/rates/items/ContinuousRatePage";

export default function ContinuousRate({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <ContinuousRateProvider
            itemId={itemId}
            itemParams={CONTINUOUS_RATE_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <ContinuousRatePage/>
        </ContinuousRateProvider>
    </LoadingProvider>
}
