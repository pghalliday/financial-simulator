import type {Route} from "./+types/ScheduledDecimalProvider";
import {useDisclosure} from "@mantine/hooks";
import {ScheduledDecimalProviderProvider} from "~/providers/item_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {SchedulesProvider} from "~/providers/items_providers";
import {SCHEDULED_DECIMAL_PROVIDER_PARAMS} from "~/page_params/decimal_providers";
import {ScheduledDecimalProviderPage} from "~/pages/decimal_providers/items/ScheduledDecimalProviderPage";

export default function ScheduledDecimalProvider({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [loadingSchedules, {
        open: startLoadingSchedules,
        close: stopLoadingSchedules,
    }] = useDisclosure()
    return <LoadingProvider loading={
        loading ||
        loadingSchedules
    }>
        <ScheduledDecimalProviderProvider
            itemId={itemId}
            itemParams={SCHEDULED_DECIMAL_PROVIDER_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <SchedulesProvider
                onBegin={startLoadingSchedules}
                onEnd={stopLoadingSchedules}
            >
                <ScheduledDecimalProviderPage/>
            </SchedulesProvider>
        </ScheduledDecimalProviderProvider>
    </LoadingProvider>
}
