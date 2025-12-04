import {Page} from "~/pages/Page";
import {useAnySchedule} from "~/providers/item_providers";
import {AnySchedulePostFormProvider} from "~/forms/schedule/contexts";
import {AnySchedulePageForms} from "~/pages/schedules/forms/AnySchedulePageForms";

export function AnySchedulePage() {
    const [schedule, _putSchedule, pageParams] = useAnySchedule({})

    return <Page
        pageParams={pageParams}
    >
        <AnySchedulePostFormProvider
            key={schedule?.id}
            initialValues={schedule}
        >
            <AnySchedulePageForms/>
        </AnySchedulePostFormProvider>
    </Page>
}
