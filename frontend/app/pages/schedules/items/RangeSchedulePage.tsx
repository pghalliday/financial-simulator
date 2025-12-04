import {Page} from "~/pages/Page";
import {useRangeSchedule} from "~/providers/item_providers";
import {RangeSchedulePostFormProvider} from "~/forms/schedule/contexts";
import {RangeSchedulePageForms} from "~/pages/schedules/forms/RangeSchedulePageForms";

export function RangeSchedulePage() {
    const [schedule, _putSchedule, pageParams] = useRangeSchedule({})

    return <Page
        pageParams={pageParams}
    >
        <RangeSchedulePostFormProvider
            key={schedule?.id}
            initialValues={schedule}
        >
            <RangeSchedulePageForms/>
        </RangeSchedulePostFormProvider>
    </Page>
}
