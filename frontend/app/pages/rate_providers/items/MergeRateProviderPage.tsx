import {Page} from "~/pages/Page";
import {useMergeRateProvider} from "~/providers/item_providers";
import {MergeRateProviderPostFormProvider} from "~/forms/rate_provider/contexts";
import {MergeRateProviderPageForms} from "~/pages/rate_providers/forms/MergeRateProviderPageForms";

export function MergeRateProviderPage() {
    const [provider, _putProvider, pageParams] = useMergeRateProvider({})

    return <Page
        pageParams={pageParams}
    >
        <MergeRateProviderPostFormProvider
            key={provider?.id}
            initialValues={provider}
        >
            <MergeRateProviderPageForms/>
        </MergeRateProviderPostFormProvider>
    </Page>
}
