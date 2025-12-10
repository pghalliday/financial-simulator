import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {RangeSchedulesPage} from "~/pages/schedules/collections/RangeSchedulesPage";
import {SchedulesProvider} from "~/providers/items_providers";

export default function RangeSchedules() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <SchedulesProvider
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <RangeSchedulesPage/>
        </SchedulesProvider>
    </LoadingProvider>
}
