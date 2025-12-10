import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {MonthlySchedulesPage} from "~/pages/schedules/collections/MonthlySchedulesPage";
import {SchedulesProvider} from "~/providers/items_providers";

export default function MonthlySchedules() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <SchedulesProvider
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <MonthlySchedulesPage/>
        </SchedulesProvider>
    </LoadingProvider>
}
