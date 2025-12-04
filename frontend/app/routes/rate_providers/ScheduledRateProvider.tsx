import type {Route} from "./+types/ScheduledRateProvider";
import {useDisclosure} from "@mantine/hooks";
import {ScheduledRateProviderProvider} from "~/providers/item_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {SCHEDULED_RATE_PROVIDER_PARAMS} from "~/page_params/rate_providers";
import {ScheduledRateProviderPage} from "~/pages/rate_providers/items/ScheduledRateProviderPage";
import {RatesProvider, SchedulesProvider} from "~/providers/items_providers";

export default function ScheduledRateProvider({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [loadingRates, {open: startLoadingRates, close: stopLoadingRates}] = useDisclosure()
    const [loadingSchedules, {
        open: startLoadingSchedules,
        close: stopLoadingSchedules,
    }] = useDisclosure()
    return <LoadingProvider loading={loading || loadingRates || loadingSchedules}>
        <ScheduledRateProviderProvider
            itemId={itemId}
            itemParams={SCHEDULED_RATE_PROVIDER_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <RatesProvider
                onBegin={startLoadingRates}
                onEnd={stopLoadingRates}
            >
                <SchedulesProvider
                    onBegin={startLoadingSchedules}
                    onEnd={stopLoadingSchedules}
                >
                    <ScheduledRateProviderPage/>
                </SchedulesProvider>
            </RatesProvider>
        </ScheduledRateProviderProvider>
    </LoadingProvider>
}
