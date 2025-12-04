import {Page} from "~/pages/Page";
import {MonthlyScheduleList} from "~/lists/schedules/MonthlyScheduleList";
import {MONTHLY_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {MonthlySchedulePostFormProvider} from "~/forms/schedule/contexts";
import {useMonthlySchedules} from "~/providers/typed_items_providers";

export function MonthlySchedulesPage() {
    const [schedules, setSchedules] = useMonthlySchedules()
    return <Page
        pageParams={{
            title: MONTHLY_SCHEDULE_PARAMS.collectionPageTitle,
            description: MONTHLY_SCHEDULE_PARAMS.collectionPageDescription,
            breadcrumbs: MONTHLY_SCHEDULE_PARAMS.collectionBreadcrumbs,
        }}
    >
        <MonthlySchedulePostFormProvider>
            <MonthlyScheduleList schedules={schedules} onChange={setSchedules}/>
        </MonthlySchedulePostFormProvider>
    </Page>
}
