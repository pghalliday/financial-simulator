import {ItemPageForm} from "~/pages/ItemPageForm";
import {useMergeRateProvider} from "~/providers/item_providers";
import {useMergeRateProviderPostFormContext} from "~/forms/rate_provider/contexts";
import {MergeRateProviderPostForm} from "~/forms/rate_provider/MergeRateProviderPostForm";

export function MergeRateProviderPageForms() {
    const providerPostForm = useMergeRateProviderPostFormContext()
    const [_provider, putProvider] = useMergeRateProvider({
        onPutSuccess: (rateProvider) => {
            providerPostForm.setInitialValues(rateProvider)
        }
    })

    return <ItemPageForm
        onSubmit={providerPostForm.onSubmit(putProvider)}
        onReset={providerPostForm.onReset}
    >
        <MergeRateProviderPostForm/>
    </ItemPageForm>
}
