import {Page} from "~/pages/Page";
import {ScheduledDecimalProviderList} from "~/lists/decimal_providers/ScheduledDecimalProviderList";
import {SCHEDULED_DECIMAL_PROVIDER_PARAMS} from "~/page_params/decimal_providers";
import {ScheduledDecimalProviderPostFormProvider} from "~/forms/decimal_provider/contexts";
import {useScheduledDecimalProviders} from "~/providers/items_providers";

export function ScheduledDecimalProvidersPage() {
    const [decimalProviders, setDecimalProviders] = useScheduledDecimalProviders()
    return <Page
        pageParams={{
            title: SCHEDULED_DECIMAL_PROVIDER_PARAMS.collectionPageTitle,
            description: SCHEDULED_DECIMAL_PROVIDER_PARAMS.collectionPageDescription,
            breadcrumbs: SCHEDULED_DECIMAL_PROVIDER_PARAMS.collectionBreadcrumbs,
        }}
    >
        <ScheduledDecimalProviderPostFormProvider>
            <ScheduledDecimalProviderList decimalProviders={decimalProviders} onChange={setDecimalProviders}/>
        </ScheduledDecimalProviderPostFormProvider>
    </Page>
}
