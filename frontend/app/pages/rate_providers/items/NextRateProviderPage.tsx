import {Page} from "~/pages/Page";
import {useNextRateProvider} from "~/providers/item_providers";
import {NextRateProviderPostFormProvider} from "~/forms/rate_provider/contexts";
import {NextRateProviderPageForms} from "~/pages/rate_providers/forms/NextRateProviderPageForms";

export function NextRateProviderPage() {
    const [provider, _putProvider, pageParams] = useNextRateProvider({})

    return <Page
        pageParams={pageParams}
    >
        <NextRateProviderPostFormProvider
            key={provider?.id}
            initialValues={provider}
        >
            <NextRateProviderPageForms/>
        </NextRateProviderPostFormProvider>
    </Page>
}
