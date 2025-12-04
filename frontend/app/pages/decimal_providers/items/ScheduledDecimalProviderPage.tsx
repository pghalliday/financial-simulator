import {Page} from "~/pages/Page";
import {useScheduledDecimalProvider} from "~/providers/item_providers";
import {ScheduledDecimalProviderPostFormProvider} from "~/forms/decimal_provider/contexts";
import {ScheduledDecimalProviderPageForms} from "~/pages/decimal_providers/forms/ScheduledDecimalProviderPageForms";

export function ScheduledDecimalProviderPage() {
    const [provider, _putProvider, pageParams] = useScheduledDecimalProvider({})

    return <Page
        pageParams={pageParams}
    >
        <ScheduledDecimalProviderPostFormProvider
            key={provider?.id}
            initialValues={provider}
        >
            <ScheduledDecimalProviderPageForms/>
        </ScheduledDecimalProviderPostFormProvider>
    </Page>
}
