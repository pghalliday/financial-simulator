import {Page} from "~/pages/Page";
import {useUntilSchedule} from "~/providers/item_providers";
import {UntilSchedulePostFormProvider} from "~/forms/schedule/contexts";
import {UntilSchedulePageForms} from "~/pages/schedules/forms/UntilSchedulePageForms";

export function UntilSchedulePage() {
    const [schedule, _putSchedule, pageParams] = useUntilSchedule({})

    return <Page
        pageParams={pageParams}
    >
        <UntilSchedulePostFormProvider
            key={schedule?.id}
            initialValues={schedule}
        >
            <UntilSchedulePageForms/>
        </UntilSchedulePostFormProvider>
    </Page>
}
