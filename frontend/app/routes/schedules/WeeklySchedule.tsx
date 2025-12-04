import type {Route} from "./+types/WeeklySchedule";
import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {WeeklyScheduleProvider} from "~/providers/item_providers";
import {WEEKLY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {WeeklySchedulePage} from "~/pages/schedules/items/WeeklySchedulePage";

export default function WeeklySchedule({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <WeeklyScheduleProvider
            itemId={itemId}
            itemParams={WEEKLY_SCHEDULE_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <WeeklySchedulePage/>
        </WeeklyScheduleProvider>
    </LoadingProvider>
}
