import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {MonthlySchedulesPage} from "~/pages/schedules/collections/MonthlySchedulesPage";
import {MonthlySchedulesProvider} from "~/providers/typed_items_providers";

export default function MonthlySchedules() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <MonthlySchedulesProvider
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <MonthlySchedulesPage/>
        </MonthlySchedulesProvider>
    </LoadingProvider>
}
