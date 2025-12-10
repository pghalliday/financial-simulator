import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {UntilSchedulesPage} from "~/pages/schedules/collections/UntilSchedulesPage";
import {SchedulesProvider} from "~/providers/items_providers";

export default function UntilSchedules() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <SchedulesProvider
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <UntilSchedulesPage/>
        </SchedulesProvider>
    </LoadingProvider>
}
