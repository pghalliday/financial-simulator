import {Page} from "~/pages/Page";
import {usePeriodicRate} from "~/providers/item_providers";
import {PeriodicRatePostFormProvider} from "~/forms/rate/contexts";
import {PeriodicRatePageForms} from "~/pages/rates/forms/PeriodicRatePageForms";

export function PeriodicRatePage() {
    const [rate, _putRate, pageParams] = usePeriodicRate({})

    return <Page
        pageParams={pageParams}
    >
        <PeriodicRatePostFormProvider
            key={rate?.id}
            initialValues={rate}
        >
            <PeriodicRatePageForms/>
        </PeriodicRatePostFormProvider>
    </Page>
}
