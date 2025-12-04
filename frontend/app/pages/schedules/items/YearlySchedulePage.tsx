import {Page} from "~/pages/Page";
import {useYearlySchedule} from "~/providers/item_providers";
import {YearlySchedulePostFormProvider} from "~/forms/schedule/contexts";
import {YearlySchedulePageForms} from "~/pages/schedules/forms/YearlySchedulePageForms";

export function YearlySchedulePage() {
    const [schedule, _putSchedule, pageParams] = useYearlySchedule({})

    return <Page
        pageParams={pageParams}
    >
        <YearlySchedulePostFormProvider
            key={schedule?.id}
            initialValues={schedule}
        >
            <YearlySchedulePageForms/>
        </YearlySchedulePostFormProvider>
    </Page>
}
