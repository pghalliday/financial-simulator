import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {DaySchedulesPage} from "~/pages/schedules/collections/DaySchedulesPage";
import {DaySchedulesProvider} from "~/providers/items_providers";

export default function DaySchedules() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <DaySchedulesProvider
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <DaySchedulesPage/>
        </DaySchedulesProvider>
    </LoadingProvider>
}
