import {useDisclosure} from "@mantine/hooks";
import {SchedulesProvider} from "~/providers/items_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import SchedulesPage from "~/pages/SchedulesPage";

export default function Schedules() {
    const [loadingRates, {open: startLoadingRates, close: stopLoadingRates}] = useDisclosure()
    return <LoadingProvider loading={loadingRates}>
        <SchedulesProvider
            onBegin={startLoadingRates}
            onEnd={stopLoadingRates}
        >
            <SchedulesPage/>
        </SchedulesProvider>
    </LoadingProvider>
}
