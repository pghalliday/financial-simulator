import {Page} from "~/pages/Page";
import {MergeRateProviderList} from "~/lists/rate_providers/MergeRateProviderList";
import {MERGE_RATE_PROVIDER_PARAMS} from "~/page_params/rate_providers";
import {MergeRateProviderPostFormProvider} from "~/forms/rate_provider/contexts";
import {useMergeRateProviders} from "~/providers/items_providers";

export function MergeRateProvidersPage() {
    const [rateProviders, setRateProviders] = useMergeRateProviders()
    return <Page
        pageParams={{
            title: MERGE_RATE_PROVIDER_PARAMS.collectionPageTitle,
            description: MERGE_RATE_PROVIDER_PARAMS.collectionPageDescription,
            breadcrumbs: MERGE_RATE_PROVIDER_PARAMS.collectionBreadcrumbs,
        }}
    >
        <MergeRateProviderPostFormProvider>
            <MergeRateProviderList rateProviders={rateProviders} onChange={setRateProviders}/>
        </MergeRateProviderPostFormProvider>
    </Page>
}
