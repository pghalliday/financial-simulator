import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {AnySchedulesPage} from "~/pages/schedules/collections/AnySchedulesPage";
import {SchedulesProvider} from "~/providers/items_providers";

export default function AnySchedules() {
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
                <AnySchedulesPage/>
            </SchedulesProvider>
        </SchedulesProvider>
    </LoadingProvider>
}
