import {Page} from "~/pages/Page";
import {YearlyScheduleList} from "~/lists/schedules/YearlyScheduleList";
import {YEARLY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {YearlySchedulePostFormProvider} from "~/forms/schedule/contexts";
import {useYearlySchedules} from "~/providers/typed_items_providers";

export function YearlySchedulesPage() {
    const [schedules, setSchedules] = useYearlySchedules()
    return <Page
        pageParams={{
            title: YEARLY_SCHEDULE_PARAMS.collectionPageTitle,
            description: YEARLY_SCHEDULE_PARAMS.collectionPageDescription,
            breadcrumbs: YEARLY_SCHEDULE_PARAMS.collectionBreadcrumbs,
        }}
    >
        <YearlySchedulePostFormProvider>
            <YearlyScheduleList schedules={schedules} onChange={setSchedules}/>
        </YearlySchedulePostFormProvider>
    </Page>
}
