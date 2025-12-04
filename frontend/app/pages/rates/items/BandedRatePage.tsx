import {Page} from "~/pages/Page";
import {useBandedRate} from "~/providers/item_providers";
import {BandedRatePostFormProvider} from "~/forms/rate/contexts";
import {BandedRatePageForms} from "~/pages/rates/forms/BandedRatePageForms";

export function BandedRatePage() {
    const [rate, _putRate, pageParams] = useBandedRate({})

    return <Page
        pageParams={pageParams}
    >
        <BandedRatePostFormProvider
            key={rate?.id}
            initialValues={rate}
        >
            <BandedRatePageForms/>
        </BandedRatePostFormProvider>
    </Page>
}
