import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {AnySchedulesPage} from "~/pages/schedules/collections/AnySchedulesPage";
import {AnySchedulesProvider} from "~/providers/typed_items_providers";
import {SchedulesProvider} from "~/providers/items_providers";

export default function AnySchedules() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [loadingSchedules, {open: startLoadingSchedules, close: stopLoadingSchedules}] = useDisclosure()
    return <LoadingProvider loading={loading || loadingSchedules}>
        <AnySchedulesProvider
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <SchedulesProvider
                onBegin={startLoadingSchedules}
                onEnd={stopLoadingSchedules}
            >
                <AnySchedulesPage/>
            </SchedulesProvider>
        </AnySchedulesProvider>
    </LoadingProvider>
}
