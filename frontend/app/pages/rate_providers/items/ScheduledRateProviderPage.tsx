import {Page} from "~/pages/Page";
import {useScheduledRateProvider} from "~/providers/item_providers";
import {ScheduledRateProviderPostFormProvider} from "~/forms/rate_provider/contexts";
import {ScheduledRateProviderPageForms} from "~/pages/rate_providers/forms/ScheduledRateProviderPageForms";

export function ScheduledRateProviderPage() {
    const [provider, _putProvider, pageParams] = useScheduledRateProvider({})

    return <Page
        pageParams={pageParams}
    >
        <ScheduledRateProviderPostFormProvider
            key={provider?.id}
            initialValues={provider}
        >
            <ScheduledRateProviderPageForms/>
        </ScheduledRateProviderPostFormProvider>
    </Page>
}
