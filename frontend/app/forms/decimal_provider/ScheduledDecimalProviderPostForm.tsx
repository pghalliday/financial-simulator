import {useSchedules} from "~/providers/items_providers";
import {BoundSelect} from "~/components/controls/bound/BoundSelect";
import {DECIMAL_PROVIDER_POST_FORM_NAME} from "~/forms/decimal_provider/DecimalProviderPostFormContext";
import {BoundNumberInput} from "~/components/controls/bound/BoundNumberInput";

export function ScheduledDecimalProviderPostForm() {
    const [schedules] = useSchedules()

    const schedulesData = schedules.map(schedule => ({
        value: schedule.id,
        label: schedule.name,
    }))

    return <>
        <BoundNumberInput
            formName={DECIMAL_PROVIDER_POST_FORM_NAME}
            type={"scheduled_decimal_provider"}
            fieldName="value"
            data={schedulesData}
            label="Value"
            description={"Value"}
            placeholder="Value"
        />
        <BoundSelect
            formName={DECIMAL_PROVIDER_POST_FORM_NAME}
            fieldName="schedule_id"
            data={schedulesData}
            label="Schedule"
            description={"Schedule"}
            placeholder="Schedule"
        />
    </>
}
