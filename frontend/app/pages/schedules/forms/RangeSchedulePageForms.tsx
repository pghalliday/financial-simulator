import {ItemPageForm} from "~/pages/ItemPageForm";
import {useRangeSchedule} from "~/providers/item_providers";
import {useRangeSchedulePostFormContext} from "~/forms/schedule/contexts";
import {RangeSchedulePostForm} from "~/forms/schedule/RangeSchedulePostForm";

export function RangeSchedulePageForms() {
    const schedulePostForm = useRangeSchedulePostFormContext()
    const [_schedule, putSchedule] = useRangeSchedule({
        onPutSuccess: (schedule) => {
            schedulePostForm.setInitialValues(schedule)
        }
    })

    return <ItemPageForm
        onSubmit={schedulePostForm.onSubmit(putSchedule)}
        onReset={schedulePostForm.onReset}
    >
        <RangeSchedulePostForm/>
    </ItemPageForm>
}
