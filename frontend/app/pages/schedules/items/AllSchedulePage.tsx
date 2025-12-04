import {Page} from "~/pages/Page";
import {useAllSchedule} from "~/providers/item_providers";
import {AllSchedulePostFormProvider} from "~/forms/schedule/contexts";
import {AllSchedulePageForms} from "~/pages/schedules/forms/AllSchedulePageForms";

export function AllSchedulePage() {
    const [schedule, _putSchedule, pageParams] = useAllSchedule({})

    return <Page
        pageParams={pageParams}
    >
        <AllSchedulePostFormProvider
            key={schedule?.id}
            initialValues={schedule}
        >
            <AllSchedulePageForms/>
        </AllSchedulePostFormProvider>
    </Page>
}
