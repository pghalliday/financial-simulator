import {Page} from "~/pages/Page";
import {AllScheduleList} from "~/lists/schedules/AllScheduleList";
import {ALL_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {AllSchedulePostFormProvider} from "~/forms/schedule/contexts";
import {useSchedules} from "~/providers/items_providers";

export function AllSchedulesPage() {
    const [schedules, setSchedules] = useSchedules()
    return <Page
        pageParams={{
            title: ALL_SCHEDULE_PARAMS.collectionPageTitle,
            description: ALL_SCHEDULE_PARAMS.collectionPageDescription,
            breadcrumbs: ALL_SCHEDULE_PARAMS.collectionBreadcrumbs,
        }}
    >
        <AllSchedulePostFormProvider>
            <AllScheduleList schedules={schedules} onChange={setSchedules}/>
        </AllSchedulePostFormProvider>
    </Page>
}
