import {Page} from "~/pages/Page";
import {NextRateProviderList} from "~/lists/rate_providers/NextRateProviderList";
import {NEXT_RATE_PROVIDER_PARAMS} from "~/page_params/rate_providers";
import {NextRateProviderPostFormProvider} from "~/forms/rate_provider/contexts";
import {useNextRateProviders} from "~/providers/items_providers";

export function NextRateProvidersPage() {
    const [rateProviders, setRateProviders] = useNextRateProviders()
    return <Page
        pageParams={{
            title: NEXT_RATE_PROVIDER_PARAMS.collectionPageTitle,
            description: NEXT_RATE_PROVIDER_PARAMS.collectionPageDescription,
            breadcrumbs: NEXT_RATE_PROVIDER_PARAMS.collectionBreadcrumbs,
        }}
    >
        <NextRateProviderPostFormProvider>
            <NextRateProviderList rateProviders={rateProviders} onChange={setRateProviders}/>
        </NextRateProviderPostFormProvider>
    </Page>
}
