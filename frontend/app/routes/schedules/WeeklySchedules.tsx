import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {WeeklySchedulesPage} from "~/pages/schedules/collections/WeeklySchedulesPage";
import {WeeklySchedulesProvider} from "~/providers/items_providers";

export default function WeeklySchedules() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <WeeklySchedulesProvider
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <WeeklySchedulesPage/>
        </WeeklySchedulesProvider>
    </LoadingProvider>
}
