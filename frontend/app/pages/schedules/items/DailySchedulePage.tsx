import {Page} from "~/pages/Page";
import {useDailySchedule} from "~/providers/item_providers";
import {DailySchedulePostFormProvider} from "~/forms/schedule/contexts";
import {DailySchedulePageForms} from "~/pages/schedules/forms/DailySchedulePageForms";

export function DailySchedulePage() {
    const [schedule, _putSchedule, pageParams] = useDailySchedule({})

    return <Page
        pageParams={pageParams}
    >
        <DailySchedulePostFormProvider
            key={schedule?.id}
            initialValues={schedule}
        >
            <DailySchedulePageForms/>
        </DailySchedulePostFormProvider>
    </Page>
}
