import {Page} from "~/pages/common/Page";
import {useProvider} from "~/providers/item_providers";
import {ProviderPostFormProvider} from "~/forms/provider/ProviderPostFormContext";
import ProviderPageForms from "~/pages/ProviderPage/ProviderPageForms";

export default function ProviderPage() {
    const [provider, _putProvider, pageParams] = useProvider({})

    return <Page
        pageParams={pageParams}
    >
        <ProviderPostFormProvider
            key={provider?.id}
            initialValues={provider}
        >
            <ProviderPageForms/>
        </ProviderPostFormProvider>
    </Page>
}
