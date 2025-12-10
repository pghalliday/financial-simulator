import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {FromSchedulesPage} from "~/pages/schedules/collections/FromSchedulesPage";
import {SchedulesProvider} from "~/providers/items_providers";

export default function FromSchedules() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <SchedulesProvider
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <FromSchedulesPage/>
        </SchedulesProvider>
    </LoadingProvider>
}
