import {Page} from "~/pages/Page";
import {ScheduledRateProviderList} from "~/lists/rate_providers/ScheduledRateProviderList";
import {useScheduledRateProviders} from "~/providers/typed_items_providers";
import {SCHEDULED_RATE_PROVIDER_PARAMS} from "~/page_params/rate_providers";
import {ScheduledRateProviderPostFormProvider} from "~/forms/rate_provider/contexts";

export function ScheduledRateProvidersPage() {
    const [rateProviders, setRateProviders] = useScheduledRateProviders()
    return <Page
        pageParams={{
            title: SCHEDULED_RATE_PROVIDER_PARAMS.collectionPageTitle,
            description: SCHEDULED_RATE_PROVIDER_PARAMS.collectionPageDescription,
            breadcrumbs: SCHEDULED_RATE_PROVIDER_PARAMS.collectionBreadcrumbs,
        }}
    >
        <ScheduledRateProviderPostFormProvider>
            <ScheduledRateProviderList rateProviders={rateProviders} onChange={setRateProviders}/>
        </ScheduledRateProviderPostFormProvider>
    </Page>
}
