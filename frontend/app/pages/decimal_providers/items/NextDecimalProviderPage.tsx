import {Page} from "~/pages/Page";
import {useNextDecimalProvider} from "~/providers/item_providers";
import {NextDecimalProviderPostFormProvider} from "~/forms/decimal_provider/contexts";
import {NextDecimalProviderPageForms} from "~/pages/decimal_providers/forms/NextDecimalProviderPageForms";

export function NextDecimalProviderPage() {
    const [provider, _putProvider, pageParams] = useNextDecimalProvider({})

    return <Page
        pageParams={pageParams}
    >
        <NextDecimalProviderPostFormProvider
            key={provider?.id}
            initialValues={provider}
        >
            <NextDecimalProviderPageForms/>
        </NextDecimalProviderPostFormProvider>
    </Page>
}
