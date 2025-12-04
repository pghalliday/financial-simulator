import {Page} from "~/pages/Page";
import {useContinuousRate} from "~/providers/item_providers";
import {ContinuousRatePostFormProvider} from "~/forms/rate/contexts";
import {ContinuousRatePageForms} from "~/pages/rates/forms/ContinuousRatePageForms";

export function ContinuousRatePage() {
    const [rate, _putRate, pageParams] = useContinuousRate({})

    return <Page
        pageParams={pageParams}
    >
        <ContinuousRatePostFormProvider
            key={rate?.id}
            initialValues={rate}
        >
            <ContinuousRatePageForms/>
        </ContinuousRatePostFormProvider>
    </Page>
}
