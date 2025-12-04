import {ItemPageForm} from "~/pages/ItemPageForm";
import {useContinuousRate} from "~/providers/item_providers";
import {useContinuousRatePostFormContext} from "~/forms/rate/contexts";
import {ContinuousRatePostForm} from "~/forms/rate/ContinuousRatePostForm";

export function ContinuousRatePageForms() {
    const ratePostForm = useContinuousRatePostFormContext()
    const [_rate, putRate] = useContinuousRate({
        onPutSuccess: (rate) => {
            ratePostForm.setInitialValues(rate)
        }
    })

    return <ItemPageForm
        onSubmit={ratePostForm.onSubmit(putRate)}
        onReset={ratePostForm.onReset}
    >
        <ContinuousRatePostForm/>
    </ItemPageForm>
}
