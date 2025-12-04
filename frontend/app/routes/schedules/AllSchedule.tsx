import type {Route} from "./+types/AllSchedule";
import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {AllScheduleProvider} from "~/providers/item_providers";
import {ALL_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {AllSchedulePage} from "~/pages/schedules/items/AllSchedulePage";
import {SchedulesProvider} from "~/providers/items_providers";

export default function AllSchedule({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [loadingSchedules, {open: startLoadingSchedules, close: stopLoadingSchedules}] = useDisclosure()
    return <LoadingProvider loading={loading || loadingSchedules}>
        <AllScheduleProvider
            itemId={itemId}
            itemParams={ALL_SCHEDULE_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <SchedulesProvider
                onBegin={startLoadingSchedules}
                onEnd={stopLoadingSchedules}
            >
                <AllSchedulePage/>
            </SchedulesProvider>
        </AllScheduleProvider>
    </LoadingProvider>
}
