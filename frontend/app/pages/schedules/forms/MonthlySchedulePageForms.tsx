import {ItemPageForm} from "~/pages/ItemPageForm";
import {useMonthlySchedule} from "~/providers/item_providers";
import {useMonthlySchedulePostFormContext} from "~/forms/schedule/contexts";
import {MonthlySchedulePostForm} from "~/forms/schedule/MonthlySchedulePostForm";

export function MonthlySchedulePageForms() {
    const schedulePostForm = useMonthlySchedulePostFormContext()
    const [_schedule, putSchedule] = useMonthlySchedule({
        onPutSuccess: (schedule) => {
            schedulePostForm.setInitialValues(schedule)
        }
    })

    return <ItemPageForm
        onSubmit={schedulePostForm.onSubmit(putSchedule)}
        onReset={schedulePostForm.onReset}
    >
        <MonthlySchedulePostForm/>
    </ItemPageForm>
}
