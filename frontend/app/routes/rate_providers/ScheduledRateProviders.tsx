import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {ScheduledRateProvidersPage} from "~/pages/rate_providers/collections/ScheduledRateProvidersPage";
import {RateProvidersProvider, RatesProvider, SchedulesProvider} from "~/providers/items_providers";

export default function ScheduledRateProviders() {
    const [loadingRateProviders, {
        open: startLoadingRateProviders,
        close: stopLoadingRateProviders,
    }] = useDisclosure()
    const [loadingRates, {open: startLoadingRates, close: stopLoadingRates}] = useDisclosure()
    const [loadingSchedules, {
        open: startLoadingSchedules,
        close: stopLoadingSchedules,
    }] = useDisclosure()
    return <LoadingProvider loading={loadingRateProviders || loadingRates || loadingSchedules}>
        <RateProvidersProvider
            onBegin={startLoadingRateProviders}
            onEnd={stopLoadingRateProviders}
        >
            <RatesProvider
                onBegin={startLoadingRates}
                onEnd={stopLoadingRates}
            >
                <SchedulesProvider
                    onBegin={startLoadingSchedules}
                    onEnd={stopLoadingSchedules}
                >
                    <ScheduledRateProvidersPage/>
                </SchedulesProvider>
            </RatesProvider>
        </RateProvidersProvider>
    </LoadingProvider>
}
