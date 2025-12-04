import {ItemPageForm} from "~/pages/ItemPageForm";
import {useDailySchedule} from "~/providers/item_providers";
import {useDailySchedulePostFormContext} from "~/forms/schedule/contexts";
import {DailySchedulePostForm} from "~/forms/schedule/DailySchedulePostForm";

export function DailySchedulePageForms() {
    const schedulePostForm = useDailySchedulePostFormContext()
    const [_schedule, putSchedule] = useDailySchedule({
        onPutSuccess: (schedule) => {
            schedulePostForm.setInitialValues(schedule)
        }
    })

    return <ItemPageForm
        onSubmit={schedulePostForm.onSubmit(putSchedule)}
        onReset={schedulePostForm.onReset}
    >
        <DailySchedulePostForm/>
    </ItemPageForm>
}
