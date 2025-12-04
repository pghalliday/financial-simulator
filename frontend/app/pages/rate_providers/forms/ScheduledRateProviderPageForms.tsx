import {ItemPageForm} from "~/pages/ItemPageForm";
import {useScheduledRateProvider} from "~/providers/item_providers";
import {useScheduledRateProviderPostFormContext} from "~/forms/rate_provider/contexts";
import {ScheduledRateProviderPostForm} from "~/forms/rate_provider/ScheduledRateProviderPostForm";

export function ScheduledRateProviderPageForms() {
    const providerPostForm = useScheduledRateProviderPostFormContext()
    const [_provider, putProvider] = useScheduledRateProvider({
        onPutSuccess: (rateProvider) => {
            providerPostForm.setInitialValues(rateProvider)
        }
    })

    return <ItemPageForm
        onSubmit={providerPostForm.onSubmit(putProvider)}
        onReset={providerPostForm.onReset}
    >
        <ScheduledRateProviderPostForm/>
    </ItemPageForm>
}
