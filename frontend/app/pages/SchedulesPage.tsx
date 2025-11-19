import {SCHEDULES_BREADCRUMBS, SCHEDULES_PAGE_DESCRIPTION, SCHEDULES_PAGE_TITLE} from "~/strings";
import {Page} from "~/pages/common/Page";
import {useSchedules} from "~/providers/items_providers";
import {SchedulePostFormProvider} from "~/forms/schedule/SchedulePostFormContext";
import {ScheduleList} from "~/lists/ScheduleList";

export default function SchedulesPage() {
    const [schedules, setSchedules] = useSchedules()
    return <Page
        pageParams={{
            title: SCHEDULES_PAGE_TITLE,
            description: SCHEDULES_PAGE_DESCRIPTION,
            breadcrumbs: SCHEDULES_BREADCRUMBS,
        }}
    >
        <SchedulePostFormProvider>
            <ScheduleList schedules={schedules} onChange={setSchedules}/>
        </SchedulePostFormProvider>
    </Page>
}
