import {Page} from "~/pages/Page";
import {useMonthlySchedule} from "~/providers/item_providers";
import {MonthlySchedulePostFormProvider} from "~/forms/schedule/contexts";
import {MonthlySchedulePageForms} from "~/pages/schedules/forms/MonthlySchedulePageForms";

export function MonthlySchedulePage() {
    const [schedule, _putSchedule, pageParams] = useMonthlySchedule({})

    return <Page
        pageParams={pageParams}
    >
        <MonthlySchedulePostFormProvider
            key={schedule?.id}
            initialValues={schedule}
        >
            <MonthlySchedulePageForms/>
        </MonthlySchedulePostFormProvider>
    </Page>
}
