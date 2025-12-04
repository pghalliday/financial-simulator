import {Page} from "~/pages/Page";
import {UntilScheduleList} from "~/lists/schedules/UntilScheduleList";
import {UNTIL_SCHEDULE_PARAMS} from "~/page_params/schedules";
import {UntilSchedulePostFormProvider} from "~/forms/schedule/contexts";
import {useUntilSchedules} from "~/providers/typed_items_providers";

export function UntilSchedulesPage() {
    const [schedules, setSchedules] = useUntilSchedules()
    return <Page
        pageParams={{
            title: UNTIL_SCHEDULE_PARAMS.collectionPageTitle,
            description: UNTIL_SCHEDULE_PARAMS.collectionPageDescription,
            breadcrumbs: UNTIL_SCHEDULE_PARAMS.collectionBreadcrumbs,
        }}
    >
        <UntilSchedulePostFormProvider>
            <UntilScheduleList schedules={schedules} onChange={setSchedules}/>
        </UntilSchedulePostFormProvider>
    </Page>
}
