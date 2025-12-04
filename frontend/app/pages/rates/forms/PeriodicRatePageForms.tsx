import {ItemPageForm} from "~/pages/ItemPageForm";
import {usePeriodicRate} from "~/providers/item_providers";
import {usePeriodicRatePostFormContext} from "~/forms/rate/contexts";
import {PeriodicRatePostForm} from "~/forms/rate/PeriodicRatePostForm";

export function PeriodicRatePageForms() {
    const ratePostForm = usePeriodicRatePostFormContext()
    const [_rate, putRate] = usePeriodicRate({
        onPutSuccess: (rate) => {
            ratePostForm.setInitialValues(rate)
        }
    })

    return <ItemPageForm
        onSubmit={ratePostForm.onSubmit(putRate)}
        onReset={ratePostForm.onReset}
    >
        <PeriodicRatePostForm/>
    </ItemPageForm>
}
