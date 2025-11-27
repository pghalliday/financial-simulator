import {useDisclosure} from "@mantine/hooks";
import {DecimalProvidersProvider, SchedulesProvider} from "~/providers/items_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import DecimalProvidersPage from "~/pages/DecimalProvidersPage";

export default function DecimalProviders() {
    const [loadingDecimalProviders, {
        open: startLoadingDecimalProviders,
        close: stopLoadingDecimalProviders,
    }] = useDisclosure()
    const [loadingSchedules, {
        open: startLoadingSchedules,
        close: stopLoadingSchedules,
    }] = useDisclosure()
    return <LoadingProvider loading={loadingDecimalProviders || loadingSchedules}>
        <DecimalProvidersProvider
            onBegin={startLoadingDecimalProviders}
            onEnd={stopLoadingDecimalProviders}
        >
            <SchedulesProvider
                onBegin={startLoadingSchedules}
                onEnd={stopLoadingSchedules}
            >
                <DecimalProvidersPage/>
            </SchedulesProvider>
        </DecimalProvidersProvider>
    </LoadingProvider>
}
