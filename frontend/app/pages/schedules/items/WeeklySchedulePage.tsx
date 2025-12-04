import {Page} from "~/pages/Page";
import {useWeeklySchedule} from "~/providers/item_providers";
import {WeeklySchedulePostFormProvider} from "~/forms/schedule/contexts";
import {WeeklySchedulePageForms} from "~/pages/schedules/forms/WeeklySchedulePageForms";

export function WeeklySchedulePage() {
    const [schedule, _putSchedule, pageParams] = useWeeklySchedule({})

    return <Page
        pageParams={pageParams}
    >
        <WeeklySchedulePostFormProvider
            key={schedule?.id}
            initialValues={schedule}
        >
            <WeeklySchedulePageForms/>
        </WeeklySchedulePostFormProvider>
    </Page>
}
