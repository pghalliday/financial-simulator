import {useDisclosure} from "@mantine/hooks";
import {SchedulesProvider} from "~/providers/items_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {ScheduledDecimalProvidersPage} from "~/pages/decimal_providers/collections/ScheduledDecimalProvidersPage";
import {ScheduledDecimalProvidersProvider} from "~/providers/typed_items_providers";

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
