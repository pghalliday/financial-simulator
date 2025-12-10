import {Page} from "~/pages/Page";
import {AnyScheduleList} from "~/lists/schedules/AnyScheduleList";
import {ANY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {AnySchedulePostFormProvider} from "~/forms/schedule/contexts";
import {useSchedules} from "~/providers/items_providers";

export function AnySchedulesPage() {
    const [schedules, setSchedules] = useSchedules()
    return <Page
        pageParams={{
            title: ANY_SCHEDULE_PARAMS.collectionPageTitle,
            description: ANY_SCHEDULE_PARAMS.collectionPageDescription,
            breadcrumbs: ANY_SCHEDULE_PARAMS.collectionBreadcrumbs,
        }}
    >
        <AnySchedulePostFormProvider>
            <AnyScheduleList schedules={schedules} onChange={setSchedules}/>
        </AnySchedulePostFormProvider>
    </Page>
}
