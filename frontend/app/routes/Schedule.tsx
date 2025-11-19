import type {Route} from "./+types/Schedule";
import {SCHEDULE_BREADCRUMBS, SCHEDULE_PAGE_DESCRIPTION, SCHEDULE_PAGE_TITLE} from "~/strings";
import {useDisclosure} from "@mantine/hooks";
import type {ItemPageParams} from "~/lib/hooks/useItemPageParams";
import type {ScheduleGet} from "~/lib/types";
import {ScheduleProvider} from "~/providers/item_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import SchedulePage from "~/pages/SchedulePage/SchedulePage";

export function getSchedulePageParams(item: ScheduleGet): ItemPageParams {
    return {
        id: item.id,
        name: item.name,
    }
}

export default function Schedule({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <ScheduleProvider
            itemId={itemId}
            itemPageTitle={SCHEDULE_PAGE_TITLE}
            itemPageDescription={SCHEDULE_PAGE_DESCRIPTION}
            itemBreadcrumbs={SCHEDULE_BREADCRUMBS}
            getItemPageParams={getSchedulePageParams}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <SchedulePage/>
        </ScheduleProvider>
    </LoadingProvider>
}
