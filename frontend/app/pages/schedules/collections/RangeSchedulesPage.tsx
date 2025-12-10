import {Page} from "~/pages/Page";
import {RangeScheduleList} from "~/lists/schedules/RangeScheduleList";
import {RANGE_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {RangeSchedulePostFormProvider} from "~/forms/schedule/contexts";
import {useSchedules} from "~/providers/items_providers";

export function RangeSchedulesPage() {
    const [schedules, setSchedules] = useSchedules()
    return <Page
        pageParams={{
            title: RANGE_SCHEDULE_PARAMS.collectionPageTitle,
            description: RANGE_SCHEDULE_PARAMS.collectionPageDescription,
            breadcrumbs: RANGE_SCHEDULE_PARAMS.collectionBreadcrumbs,
        }}
    >
        <RangeSchedulePostFormProvider>
            <RangeScheduleList schedules={schedules} onChange={setSchedules}/>
        </RangeSchedulePostFormProvider>
    </Page>
}
