import {ItemPageForm} from "~/pages/ItemPageForm";
import {useUntilSchedule} from "~/providers/item_providers";
import {useUntilSchedulePostFormContext} from "~/forms/schedule/contexts";
import {UntilSchedulePostForm} from "~/forms/schedule/UntilSchedulePostForm";

export function UntilSchedulePageForms() {
    const schedulePostForm = useUntilSchedulePostFormContext()
    const [_schedule, putSchedule] = useUntilSchedule({
        onPutSuccess: (schedule) => {
            schedulePostForm.setInitialValues(schedule)
        }
    })

    return <ItemPageForm
        onSubmit={schedulePostForm.onSubmit(putSchedule)}
        onReset={schedulePostForm.onReset}
    >
        <UntilSchedulePostForm/>
    </ItemPageForm>
}
