import {ItemPageForm} from "~/pages/common/ItemPageForm";
import {useRate} from "~/providers/item_providers";
import {useFormContext} from "~/lib/hooks/useFormContext";
import {RATE_POST_FORM_NAME} from "~/forms/rate/RatePostFormContext";
import {RatePostForm} from "~/forms/rate/RatePostForm";

export default function RatePageForms() {
    const ratePostForm = useFormContext(RATE_POST_FORM_NAME)
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
