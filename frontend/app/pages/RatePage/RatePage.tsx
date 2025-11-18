import {Page} from "~/pages/common/Page";
import {useRate} from "~/providers/item_providers";
import {RatePostFormProvider} from "~/forms/rate/RatePostFormContext";
import RatePageForms from "~/pages/RatePage/RatePageForms";

export default function RatePage() {
    const [rate, _putRate, pageParams] = useRate({})

    return <Page
        pageParams={pageParams}
    >
        <RatePostFormProvider
            key={rate?.id}
            initialValues={rate}
        >
            <RatePageForms/>
        </RatePostFormProvider>
    </Page>
}
