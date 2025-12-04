import type {Route} from "./+types/UntilSchedule";
import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {UntilScheduleProvider} from "~/providers/item_providers";
import {UNTIL_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {UntilSchedulePage} from "~/pages/schedules/items/UntilSchedulePage";

export default function UntilSchedule({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <UntilScheduleProvider
            itemId={itemId}
            itemParams={UNTIL_SCHEDULE_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <UntilSchedulePage/>
        </UntilScheduleProvider>
    </LoadingProvider>
}
