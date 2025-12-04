import type {Route} from "./+types/MonthlySchedule";
import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {MonthlyScheduleProvider} from "~/providers/item_providers";
import {MONTHLY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {MonthlySchedulePage} from "~/pages/schedules/items/MonthlySchedulePage";

export default function MonthlySchedule({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <MonthlyScheduleProvider
            itemId={itemId}
            itemParams={MONTHLY_SCHEDULE_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <MonthlySchedulePage/>
        </MonthlyScheduleProvider>
    </LoadingProvider>
}
