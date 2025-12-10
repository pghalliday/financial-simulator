import {Page} from "~/pages/Page";
import {FromScheduleList} from "~/lists/schedules/FromScheduleList";
import {FROM_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {FromSchedulePostFormProvider} from "~/forms/schedule/contexts";
import {useSchedules} from "~/providers/items_providers";

export function FromSchedulesPage() {
    const [schedules, setSchedules] = useSchedules()
    return <Page
        pageParams={{
            title: FROM_SCHEDULE_PARAMS.collectionPageTitle,
            description: FROM_SCHEDULE_PARAMS.collectionPageDescription,
            breadcrumbs: FROM_SCHEDULE_PARAMS.collectionBreadcrumbs,
        }}
    >
        <FromSchedulePostFormProvider>
            <FromScheduleList schedules={schedules} onChange={setSchedules}/>
        </FromSchedulePostFormProvider>
    </Page>
}
