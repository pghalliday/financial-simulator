import {ItemPageForm} from "~/pages/ItemPageForm";
import {useNextRateProvider} from "~/providers/item_providers";
import {useNextRateProviderPostFormContext} from "~/forms/rate_provider/contexts";
import {NextRateProviderPostForm} from "~/forms/rate_provider/NextRateProviderPostForm";

export function NextRateProviderPageForms() {
    const providerPostForm = useNextRateProviderPostFormContext()
    const [_provider, putProvider] = useNextRateProvider({
        onPutSuccess: (rateProvider) => {
            providerPostForm.setInitialValues(rateProvider)
        }
    })

    return <ItemPageForm
        onSubmit={providerPostForm.onSubmit(putProvider)}
        onReset={providerPostForm.onReset}
    >
        <NextRateProviderPostForm/>
    </ItemPageForm>
}
