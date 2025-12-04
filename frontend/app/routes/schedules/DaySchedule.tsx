import type {Route} from "./+types/DaySchedule";
import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {DayScheduleProvider} from "~/providers/item_providers";
import {DAY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {DaySchedulePage} from "~/pages/schedules/items/DaySchedulePage";

export default function DaySchedule({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <DayScheduleProvider
            itemId={itemId}
            itemParams={DAY_SCHEDULE_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <DaySchedulePage/>
        </DayScheduleProvider>
    </LoadingProvider>
}
