import {RATE_PROVIDERS_BREADCRUMBS, RATE_PROVIDERS_PAGE_DESCRIPTION, RATE_PROVIDERS_PAGE_TITLE} from "~/strings";
import {Page} from "~/pages/common/Page";
import {useRateProviders} from "~/providers/items_providers";
import {RateProviderPostFormProvider} from "~/forms/rate_provider/RateProviderPostFormContext";
import {RateProviderList} from "~/lists/RateProviderList";

export default function RateProvidersPage() {
    const [rateProviders, setRateProviders] = useRateProviders()
    return <Page
        pageParams={{
            title: RATE_PROVIDERS_PAGE_TITLE,
            description: RATE_PROVIDERS_PAGE_DESCRIPTION,
            breadcrumbs: RATE_PROVIDERS_BREADCRUMBS,
        }}
    >
        <RateProviderPostFormProvider>
            <RateProviderList rateProviders={rateProviders} onChange={setRateProviders}/>
        </RateProviderPostFormProvider>
    </Page>
}
