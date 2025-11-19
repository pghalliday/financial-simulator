import {ItemPageForm} from "~/pages/common/ItemPageForm";
import {useSchedule} from "~/providers/item_providers";
import {SCHEDULE_POST_FORM_NAME, useSchedulePostFormContext} from "~/forms/schedule/SchedulePostFormContext";
import {SchedulePostForm} from "~/forms/schedule/SchedulePostForm";

export default function SchedulePageForms() {
    const schedulePostForm = useSchedulePostFormContext()
    const [_schedule, putSchedule] = useSchedule({
        onPutSuccess: (schedule) => {
            schedulePostForm.setInitialValues(schedule)
        }
    })

    return <ItemPageForm
        formName={SCHEDULE_POST_FORM_NAME}
        onSubmit={putSchedule}
    >
        <SchedulePostForm/>
    </ItemPageForm>
}
