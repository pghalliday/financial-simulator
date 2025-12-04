import type {Route} from "./+types/YearlySchedule";
import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {YearlyScheduleProvider} from "~/providers/item_providers";
import {YEARLY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {YearlySchedulePage} from "~/pages/schedules/items/YearlySchedulePage";

export default function YearlySchedule({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <YearlyScheduleProvider
            itemId={itemId}
            itemParams={YEARLY_SCHEDULE_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <YearlySchedulePage/>
        </YearlyScheduleProvider>
    </LoadingProvider>
}
