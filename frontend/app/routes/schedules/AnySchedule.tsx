import type {Route} from "./+types/AnySchedule";
import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {AnyScheduleProvider} from "~/providers/item_providers";
import {ANY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {AnySchedulePage} from "~/pages/schedules/items/AnySchedulePage";
import {SchedulesProvider} from "~/providers/items_providers";

export default function AnySchedule({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [loadingSchedules, {open: startLoadingSchedules, close: stopLoadingSchedules}] = useDisclosure()
    return <LoadingProvider loading={loading || loadingSchedules}>
        <AnyScheduleProvider
            itemId={itemId}
            itemParams={ANY_SCHEDULE_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <SchedulesProvider
                onBegin={startLoadingSchedules}
                onEnd={stopLoadingSchedules}
            >
                <AnySchedulePage/>
            </SchedulesProvider>
        </AnyScheduleProvider>
    </LoadingProvider>
}
