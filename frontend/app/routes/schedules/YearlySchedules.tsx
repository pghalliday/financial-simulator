import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {YearlySchedulesPage} from "~/pages/schedules/collections/YearlySchedulesPage";
import {SchedulesProvider} from "~/providers/items_providers";

export default function YearlySchedules() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <SchedulesProvider
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <YearlySchedulesPage/>
        </SchedulesProvider>
    </LoadingProvider>
}
