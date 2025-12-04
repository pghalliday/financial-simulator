import {ItemPageForm} from "~/pages/ItemPageForm";
import {useAllSchedule} from "~/providers/item_providers";
import {useAllSchedulePostFormContext} from "~/forms/schedule/contexts";
import {AllSchedulePostForm} from "~/forms/schedule/AllSchedulePostForm";

export function AllSchedulePageForms() {
    const schedulePostForm = useAllSchedulePostFormContext()
    const [_schedule, putSchedule] = useAllSchedule({
        onPutSuccess: (schedule) => {
            schedulePostForm.setInitialValues(schedule)
        }
    })

    return <ItemPageForm
        onSubmit={schedulePostForm.onSubmit(putSchedule)}
        onReset={schedulePostForm.onReset}
    >
        <AllSchedulePostForm/>
    </ItemPageForm>
}
