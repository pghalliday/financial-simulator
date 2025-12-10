import {Page} from "~/pages/Page";
import {DailyScheduleList} from "~/lists/schedules/DailyScheduleList";
import {DAILY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {DailySchedulePostFormProvider} from "~/forms/schedule/contexts";
import {useSchedules} from "~/providers/items_providers";

export function DailySchedulesPage() {
    const [schedules, setSchedules] = useSchedules()
    return <Page
        pageParams={{
            title: DAILY_SCHEDULE_PARAMS.collectionPageTitle,
            description: DAILY_SCHEDULE_PARAMS.collectionPageDescription,
            breadcrumbs: DAILY_SCHEDULE_PARAMS.collectionBreadcrumbs,
        }}
    >
        <DailySchedulePostFormProvider>
            <DailyScheduleList schedules={schedules} onChange={setSchedules}/>
        </DailySchedulePostFormProvider>
    </Page>
}
