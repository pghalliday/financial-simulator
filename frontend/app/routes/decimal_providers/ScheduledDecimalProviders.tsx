import {useDisclosure} from "@mantine/hooks";
import {ScheduledDecimalProvidersProvider, SchedulesProvider} from "~/providers/items_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {ScheduledDecimalProvidersPage} from "~/pages/decimal_providers/collections/ScheduledDecimalProvidersPage";

export default function ScheduledDecimalProviders() {
    const [loadingDecimalProviders, {
        open: startLoadingDecimalProviders,
        close: stopLoadingDecimalProviders,
    }] = useDisclosure()
    const [loadingSchedules, {
        open: startLoadingSchedules,
        close: stopLoadingSchedules,
    }] = useDisclosure()
    return <LoadingProvider loading={loadingDecimalProviders || loadingSchedules}>
        <ScheduledDecimalProvidersProvider
            onBegin={startLoadingDecimalProviders}
            onEnd={stopLoadingDecimalProviders}
        >
            <SchedulesProvider
                onBegin={startLoadingSchedules}
                onEnd={stopLoadingSchedules}
            >
                <ScheduledDecimalProvidersPage/>
            </SchedulesProvider>
        </ScheduledDecimalProvidersProvider>
    </LoadingProvider>
}
