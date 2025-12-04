import {Page} from "~/pages/Page";
import {DayScheduleList} from "~/lists/schedules/DayScheduleList";
import {DAY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {DaySchedulePostFormProvider} from "~/forms/schedule/contexts";
import {useDaySchedules} from "~/providers/typed_items_providers";

export function DaySchedulesPage() {
    const [schedules, setSchedules] = useDaySchedules()
    return <Page
        pageParams={{
            title: DAY_SCHEDULE_PARAMS.collectionPageTitle,
            description: DAY_SCHEDULE_PARAMS.collectionPageDescription,
            breadcrumbs: DAY_SCHEDULE_PARAMS.collectionBreadcrumbs,
        }}
    >
        <DaySchedulePostFormProvider>
            <DayScheduleList schedules={schedules} onChange={setSchedules}/>
        </DaySchedulePostFormProvider>
    </Page>
}
