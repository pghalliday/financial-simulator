import {ItemPageForm} from "~/pages/ItemPageForm";
import {useBandedRate} from "~/providers/item_providers";
import {useBandedRatePostFormContext} from "~/forms/rate/contexts";
import {BandedRatePostForm} from "~/forms/rate/BandedRatePostForm";

export function BandedRatePageForms() {
    const ratePostForm = useBandedRatePostFormContext()
    const [_rate, putRate] = useBandedRate({
        onPutSuccess: (rate) => {
            ratePostForm.setInitialValues(rate)
        }
    })

    return <ItemPageForm
        onSubmit={ratePostForm.onSubmit(putRate)}
        onReset={ratePostForm.onReset}
    >
        <BandedRatePostForm/>
    </ItemPageForm>
}
