import {ItemPageForm} from "~/pages/common/ItemPageForm";
import {useRateProvider} from "~/providers/item_providers";
import {
    RATE_PROVIDER_POST_FORM_NAME,
    useRateProviderPostFormContext
} from "~/forms/rate_provider/RateProviderPostFormContext";
import {RateProviderPostForm} from "~/forms/rate_provider/RateProviderPostForm";

export default function RateProviderPageForms() {
    const providerPostForm = useRateProviderPostFormContext()
    const [_provider, putProvider] = useRateProvider({
        onPutSuccess: (rateProvider) => {
            providerPostForm.setInitialValues(rateProvider)
        }
    })

    return <ItemPageForm
        formName={RATE_PROVIDER_POST_FORM_NAME}
        onSubmit={putProvider}
    >
        <RateProviderPostForm/>
    </ItemPageForm>
}
