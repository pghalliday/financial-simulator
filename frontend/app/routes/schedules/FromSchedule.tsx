import type {Route} from "./+types/FromSchedule";
import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {FromScheduleProvider} from "~/providers/item_providers";
import {FROM_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {FromSchedulePage} from "~/pages/schedules/items/FromSchedulePage";

export default function FromSchedule({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <FromScheduleProvider
            itemId={itemId}
            itemParams={FROM_SCHEDULE_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <FromSchedulePage/>
        </FromScheduleProvider>
    </LoadingProvider>
}
