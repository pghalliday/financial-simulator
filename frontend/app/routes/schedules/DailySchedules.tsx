import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {DailySchedulesPage} from "~/pages/schedules/collections/DailySchedulesPage";
import {SchedulesProvider} from "~/providers/items_providers";

export default function DailySchedules() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <SchedulesProvider
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <DailySchedulesPage/>
        </SchedulesProvider>
    </LoadingProvider>
}
