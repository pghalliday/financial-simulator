import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {AllSchedulesPage} from "~/pages/schedules/collections/AllSchedulesPage";
import {SchedulesProvider} from "~/providers/items_providers";

export default function AllSchedules() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [loadingSchedules, {open: startLoadingSchedules, close: stopLoadingSchedules}] = useDisclosure()
    return <LoadingProvider loading={loading || loadingSchedules}>
        <SchedulesProvider
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <SchedulesProvider
                onBegin={startLoadingSchedules}
                onEnd={stopLoadingSchedules}
            >
                <AllSchedulesPage/>
            </SchedulesProvider>
        </SchedulesProvider>
    </LoadingProvider>
}
