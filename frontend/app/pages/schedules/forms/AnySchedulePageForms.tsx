import {ItemPageForm} from "~/pages/ItemPageForm";
import {useAnySchedule} from "~/providers/item_providers";
import {useAnySchedulePostFormContext} from "~/forms/schedule/contexts";
import {AnySchedulePostForm} from "~/forms/schedule/AnySchedulePostForm";

export function AnySchedulePageForms() {
    const schedulePostForm = useAnySchedulePostFormContext()
    const [_schedule, putSchedule] = useAnySchedule({
        onPutSuccess: (schedule) => {
            schedulePostForm.setInitialValues(schedule)
        }
    })

    return <ItemPageForm
        onSubmit={schedulePostForm.onSubmit(putSchedule)}
        onReset={schedulePostForm.onReset}
    >
        <AnySchedulePostForm/>
    </ItemPageForm>
}
