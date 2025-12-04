import {ItemPageForm} from "~/pages/ItemPageForm";
import {useDaySchedule} from "~/providers/item_providers";
import {useDaySchedulePostFormContext} from "~/forms/schedule/contexts";
import {DaySchedulePostForm} from "~/forms/schedule/DaySchedulePostForm";

export function DaySchedulePageForms() {
    const schedulePostForm = useDaySchedulePostFormContext()
    const [_schedule, putSchedule] = useDaySchedule({
        onPutSuccess: (schedule) => {
            schedulePostForm.setInitialValues(schedule)
        }
    })

    return <ItemPageForm
        onSubmit={schedulePostForm.onSubmit(putSchedule)}
        onReset={schedulePostForm.onReset}
    >
        <DaySchedulePostForm/>
    </ItemPageForm>
}
