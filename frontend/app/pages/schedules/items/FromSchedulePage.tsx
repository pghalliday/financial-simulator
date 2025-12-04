import {Page} from "~/pages/Page";
import {useFromSchedule} from "~/providers/item_providers";
import {FromSchedulePostFormProvider} from "~/forms/schedule/contexts";
import {FromSchedulePageForms} from "~/pages/schedules/forms/FromSchedulePageForms";

export function FromSchedulePage() {
    const [schedule, _putSchedule, pageParams] = useFromSchedule({})

    return <Page
        pageParams={pageParams}
    >
        <FromSchedulePostFormProvider
            key={schedule?.id}
            initialValues={schedule}
        >
            <FromSchedulePageForms/>
        </FromSchedulePostFormProvider>
    </Page>
}
