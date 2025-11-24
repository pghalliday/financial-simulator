import {Page} from "~/pages/common/Page";
import {useRateProvider} from "~/providers/item_providers";
import {RateProviderPostFormProvider} from "~/forms/rate_provider/RateProviderPostFormContext";
import RateProviderPageForms from "~/pages/RateProviderPage/RateProviderPageForms";

export default function RateProviderPage() {
    const [provider, _putProvider, pageParams] = useRateProvider({})

    return <Page
        pageParams={pageParams}
    >
        <RateProviderPostFormProvider
            key={provider?.id}
            initialValues={provider}
        >
            <RateProviderPageForms/>
        </RateProviderPostFormProvider>
    </Page>
}
