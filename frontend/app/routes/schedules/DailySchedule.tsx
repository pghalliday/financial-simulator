import type {Route} from "./+types/DailySchedule";
import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {DailyScheduleProvider} from "~/providers/item_providers";
import {DAILY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {DailySchedulePage} from "~/pages/schedules/items/DailySchedulePage";

export default function DailySchedule({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <DailyScheduleProvider
            itemId={itemId}
            itemParams={DAILY_SCHEDULE_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <DailySchedulePage/>
        </DailyScheduleProvider>
    </LoadingProvider>
}
