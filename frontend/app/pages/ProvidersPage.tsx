import {PROVIDERS_BREADCRUMBS, PROVIDERS_PAGE_DESCRIPTION, PROVIDERS_PAGE_TITLE} from "~/strings";
import {Page} from "~/pages/common/Page";
import {useProviders} from "~/providers/items_providers";
import {ProviderPostFormProvider} from "~/forms/provider/ProviderPostFormContext";
import {ProviderList} from "~/lists/ProviderList";

export default function ProvidersPage() {
    const [providers, setProviders] = useProviders()
    return <Page
        pageParams={{
            title: PROVIDERS_PAGE_TITLE,
            description: PROVIDERS_PAGE_DESCRIPTION,
            breadcrumbs: PROVIDERS_BREADCRUMBS,
        }}
    >
        <ProviderPostFormProvider>
            <ProviderList providers={providers} onChange={setProviders}/>
        </ProviderPostFormProvider>
    </Page>
}
