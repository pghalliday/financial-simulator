import {Page} from "~/pages/common/Page";
import {useSchedule} from "~/providers/item_providers";
import {SchedulePostFormProvider} from "~/forms/schedule/SchedulePostFormContext";
import SchedulePageForms from "~/pages/SchedulePage/SchedulePageForms";

export default function SchedulePage() {
    const [schedule, _putSchedule, pageParams] = useSchedule({})

    return <Page
        pageParams={pageParams}
    >
        <SchedulePostFormProvider
            key={schedule?.id}
            initialValues={schedule}
        >
            <SchedulePageForms/>
        </SchedulePostFormProvider>
    </Page>
}
