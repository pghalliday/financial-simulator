import {ItemPageForm} from "~/pages/ItemPageForm";
import {useWeeklySchedule} from "~/providers/item_providers";
import {useWeeklySchedulePostFormContext} from "~/forms/schedule/contexts";
import {WeeklySchedulePostForm} from "~/forms/schedule/WeeklySchedulePostForm";

export function WeeklySchedulePageForms() {
    const schedulePostForm = useWeeklySchedulePostFormContext()
    const [_schedule, putSchedule] = useWeeklySchedule({
        onPutSuccess: (schedule) => {
            schedulePostForm.setInitialValues(schedule)
        }
    })

    return <ItemPageForm
        onSubmit={schedulePostForm.onSubmit(putSchedule)}
        onReset={schedulePostForm.onReset}
    >
        <WeeklySchedulePostForm/>
    </ItemPageForm>
}
