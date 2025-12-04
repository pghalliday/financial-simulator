import {Page} from "~/pages/Page";
import {useDaySchedule} from "~/providers/item_providers";
import {DaySchedulePostFormProvider} from "~/forms/schedule/contexts";
import {DaySchedulePageForms} from "~/pages/schedules/forms/DaySchedulePageForms";

export function DaySchedulePage() {
    const [schedule, _putSchedule, pageParams] = useDaySchedule({})

    return <Page
        pageParams={pageParams}
    >
        <DaySchedulePostFormProvider
            key={schedule?.id}
            initialValues={schedule}
        >
            <DaySchedulePageForms/>
        </DaySchedulePostFormProvider>
    </Page>
}
