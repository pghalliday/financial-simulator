import {ItemPageForm} from "~/pages/ItemPageForm";
import {useFromSchedule} from "~/providers/item_providers";
import {useFromSchedulePostFormContext} from "~/forms/schedule/contexts";
import {FromSchedulePostForm} from "~/forms/schedule/FromSchedulePostForm";

export function FromSchedulePageForms() {
    const schedulePostForm = useFromSchedulePostFormContext()
    const [_schedule, putSchedule] = useFromSchedule({
        onPutSuccess: (schedule) => {
            schedulePostForm.setInitialValues(schedule)
        }
    })

    return <ItemPageForm
        onSubmit={schedulePostForm.onSubmit(putSchedule)}
        onReset={schedulePostForm.onReset}
    >
        <FromSchedulePostForm/>
    </ItemPageForm>
}
