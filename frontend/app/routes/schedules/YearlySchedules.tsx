import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {YearlySchedulesPage} from "~/pages/schedules/collections/YearlySchedulesPage";
import {YearlySchedulesProvider} from "~/providers/typed_items_providers";

export default function YearlySchedules() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <YearlySchedulesProvider
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <YearlySchedulesPage/>
        </YearlySchedulesProvider>
    </LoadingProvider>
}
