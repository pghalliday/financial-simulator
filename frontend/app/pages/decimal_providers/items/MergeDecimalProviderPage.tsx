import {Page} from "~/pages/Page";
import {useMergeDecimalProvider} from "~/providers/item_providers";
import {MergeDecimalProviderPostFormProvider} from "~/forms/decimal_provider/contexts";
import {MergeDecimalProviderPageForms} from "~/pages/decimal_providers/forms/MergeDecimalProviderPageForms";

export function MergeDecimalProviderPage() {
    const [provider, _putProvider, pageParams] = useMergeDecimalProvider({})

    return <Page
        pageParams={pageParams}
    >
        <MergeDecimalProviderPostFormProvider
            key={provider?.id}
            initialValues={provider}
        >
            <MergeDecimalProviderPageForms/>
        </MergeDecimalProviderPostFormProvider>
    </Page>
}
