import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {ScheduledRateProvidersPage} from "~/pages/rate_providers/collections/ScheduledRateProvidersPage";
import {RatesProvider, ScheduledRateProvidersProvider, SchedulesProvider} from "~/providers/items_providers";

export default function ScheduledRateProviders() {
    const [loadingScheduledRateProviders, {
        open: startLoadingScheduledRateProviders,
        close: stopLoadingScheduledRateProviders,
    }] = useDisclosure()
    const [loadingRates, {open: startLoadingRates, close: stopLoadingRates}] = useDisclosure()
    const [loadingSchedules, {
        open: startLoadingSchedules,
        close: stopLoadingSchedules,
    }] = useDisclosure()
    return <LoadingProvider loading={loadingScheduledRateProviders || loadingRates || loadingSchedules}>
        <ScheduledRateProvidersProvider
            onBegin={startLoadingScheduledRateProviders}
            onEnd={stopLoadingScheduledRateProviders}
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
        </ScheduledRateProvidersProvider>
    </LoadingProvider>
}
