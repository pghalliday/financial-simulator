import {ItemPageForm} from "~/pages/common/ItemPageForm";
import {useRate} from "~/providers/item_providers";
import {RATE_POST_FORM_NAME, useRatePostFormContext} from "~/forms/rate/RatePostFormContext";
import {RatePostForm} from "~/forms/rate/RatePostForm";

export default function RatePageForms() {
    const ratePostForm = useRatePostFormContext()
    const [_rate, putRate] = useRate({
        onPutSuccess: (rate) => {
            ratePostForm.setInitialValues(rate)
        }
    })

    return <ItemPageForm
        formName={RATE_POST_FORM_NAME}
        onSubmit={putRate}
    >
        <RatePostForm/>
    </ItemPageForm>
}
