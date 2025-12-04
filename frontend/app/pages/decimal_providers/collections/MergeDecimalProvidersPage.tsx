import {Page} from "~/pages/Page";
import {MergeDecimalProviderList} from "~/lists/decimal_providers/MergeDecimalProviderList";
import {MERGE_DECIMAL_PROVIDER_PARAMS} from "~/page_params/decimal_providers";
import {MergeDecimalProviderPostFormProvider} from "~/forms/decimal_provider/contexts";
import {useMergeDecimalProviders} from "~/providers/items_providers";

export function MergeDecimalProvidersPage() {
    const [decimalProviders, setDecimalProviders] = useMergeDecimalProviders()
    return <Page
        pageParams={{
            title: MERGE_DECIMAL_PROVIDER_PARAMS.collectionPageTitle,
            description: MERGE_DECIMAL_PROVIDER_PARAMS.collectionPageDescription,
            breadcrumbs: MERGE_DECIMAL_PROVIDER_PARAMS.collectionBreadcrumbs,
        }}
    >
        <MergeDecimalProviderPostFormProvider>
            <MergeDecimalProviderList decimalProviders={decimalProviders} onChange={setDecimalProviders}/>
        </MergeDecimalProviderPostFormProvider>
    </Page>
}
