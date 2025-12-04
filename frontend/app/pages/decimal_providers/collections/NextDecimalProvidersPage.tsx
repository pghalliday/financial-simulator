import {Page} from "~/pages/Page";
import {NextDecimalProviderList} from "~/lists/decimal_providers/NextDecimalProviderList";
import {useNextDecimalProviders} from "~/providers/typed_items_providers";
import {NEXT_DECIMAL_PROVIDER_PARAMS} from "~/page_params/decimal_providers";
import {NextDecimalProviderPostFormProvider} from "~/forms/decimal_provider/contexts";

export function NextDecimalProvidersPage() {
    const [decimalProviders, setDecimalProviders] = useNextDecimalProviders()
    return <Page
        pageParams={{
            title: NEXT_DECIMAL_PROVIDER_PARAMS.collectionPageTitle,
            description: NEXT_DECIMAL_PROVIDER_PARAMS.collectionPageDescription,
            breadcrumbs: NEXT_DECIMAL_PROVIDER_PARAMS.collectionBreadcrumbs,
        }}
    >
        <NextDecimalProviderPostFormProvider>
            <NextDecimalProviderList decimalProviders={decimalProviders} onChange={setDecimalProviders}/>
        </NextDecimalProviderPostFormProvider>
    </Page>
}
