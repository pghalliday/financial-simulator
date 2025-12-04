import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {DailySchedulesPage} from "~/pages/schedules/collections/DailySchedulesPage";
import {DailySchedulesProvider} from "~/providers/typed_items_providers";

export default function DailySchedules() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <DailySchedulesProvider
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <DailySchedulesPage/>
        </DailySchedulesProvider>
    </LoadingProvider>
}
