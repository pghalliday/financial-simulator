import {ItemPageForm} from "~/pages/ItemPageForm";
import {useYearlySchedule} from "~/providers/item_providers";
import {useYearlySchedulePostFormContext} from "~/forms/schedule/contexts";
import {YearlySchedulePostForm} from "~/forms/schedule/YearlySchedulePostForm";

export function YearlySchedulePageForms() {
    const schedulePostForm = useYearlySchedulePostFormContext()
    const [_schedule, putSchedule] = useYearlySchedule({
        onPutSuccess: (schedule) => {
            schedulePostForm.setInitialValues(schedule)
        }
    })

    return <ItemPageForm
        onSubmit={schedulePostForm.onSubmit(putSchedule)}
        onReset={schedulePostForm.onReset}
    >
        <YearlySchedulePostForm/>
    </ItemPageForm>
}
