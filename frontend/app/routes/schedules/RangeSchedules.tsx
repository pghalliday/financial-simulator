import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {RangeSchedulesPage} from "~/pages/schedules/collections/RangeSchedulesPage";
import {RangeSchedulesProvider} from "~/providers/items_providers";

export default function RangeSchedules() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <RangeSchedulesProvider
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <RangeSchedulesPage/>
        </RangeSchedulesProvider>
    </LoadingProvider>
}
