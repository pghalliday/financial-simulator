import {Page} from "~/pages/Page";
import {WeeklyScheduleList} from "~/lists/schedules/WeeklyScheduleList";
import {WEEKLY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {WeeklySchedulePostFormProvider} from "~/forms/schedule/contexts";
import {useSchedules} from "~/providers/items_providers";

export function WeeklySchedulesPage() {
    const [schedules, setSchedules] = useSchedules()
    return <Page
        pageParams={{
            title: WEEKLY_SCHEDULE_PARAMS.collectionPageTitle,
            description: WEEKLY_SCHEDULE_PARAMS.collectionPageDescription,
            breadcrumbs: WEEKLY_SCHEDULE_PARAMS.collectionBreadcrumbs,
        }}
    >
        <WeeklySchedulePostFormProvider>
            <WeeklyScheduleList schedules={schedules} onChange={setSchedules}/>
        </WeeklySchedulePostFormProvider>
    </Page>
}
