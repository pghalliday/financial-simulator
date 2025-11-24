import {Page} from "~/pages/common/Page";
import {useDecimalProvider} from "~/providers/item_providers";
import {DecimalProviderPostFormProvider} from "~/forms/decimal_provider/DecimalProviderPostFormContext";
import DecimalProviderPageForms from "~/pages/DecimalProviderPage/DecimalProviderPageForms";

export default function DecimalProviderPage() {
    const [provider, _putProvider, pageParams] = useDecimalProvider({})

    return <Page
        pageParams={pageParams}
    >
        <DecimalProviderPostFormProvider
            key={provider?.id}
            initialValues={provider}
        >
            <DecimalProviderPageForms/>
        </DecimalProviderPostFormProvider>
    </Page>
}
