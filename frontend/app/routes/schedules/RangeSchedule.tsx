import type {Route} from "./+types/RangeSchedule";
import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {RangeScheduleProvider} from "~/providers/item_providers";
import {RANGE_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {RangeSchedulePage} from "~/pages/schedules/items/RangeSchedulePage";

export default function RangeSchedule({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <RangeScheduleProvider
            itemId={itemId}
            itemParams={RANGE_SCHEDULE_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <RangeSchedulePage/>
        </RangeScheduleProvider>
    </LoadingProvider>
}
