import type {Route} from "./+types/PeriodicRate";
import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {PeriodicRateProvider} from "~/providers/item_providers";
import {PERIODIC_RATE_PARAMS} from "~/page_params/rates";
import {PeriodicRatePage} from "~/pages/rates/items/PeriodicRatePage";

export default function PeriodicRate({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <PeriodicRateProvider
            itemId={itemId}
            itemParams={PERIODIC_RATE_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <PeriodicRatePage/>
        </PeriodicRateProvider>
    </LoadingProvider>
}
