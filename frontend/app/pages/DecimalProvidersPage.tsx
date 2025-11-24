import {
    DECIMAL_PROVIDERS_BREADCRUMBS,
    DECIMAL_PROVIDERS_PAGE_DESCRIPTION,
    DECIMAL_PROVIDERS_PAGE_TITLE
} from "~/strings";
import {Page} from "~/pages/common/Page";
import {useDecimalProviders} from "~/providers/items_providers";
import {DecimalProviderPostFormProvider} from "~/forms/decimal_provider/DecimalProviderPostFormContext";
import {DecimalProviderList} from "~/lists/DecimalProviderList";

export default function DecimalProvidersPage() {
    const [decimalProviders, setDecimalProviders] = useDecimalProviders()
    return <Page
        pageParams={{
            title: DECIMAL_PROVIDERS_PAGE_TITLE,
            description: DECIMAL_PROVIDERS_PAGE_DESCRIPTION,
            breadcrumbs: DECIMAL_PROVIDERS_BREADCRUMBS,
        }}
    >
        <DecimalProviderPostFormProvider>
            <DecimalProviderList decimalProviders={decimalProviders} onChange={setDecimalProviders}/>
        </DecimalProviderPostFormProvider>
    </Page>
}
