import {RATES_BREADCRUMBS, RATES_PAGE_DESCRIPTION, RATES_PAGE_TITLE} from "~/strings";
import {Page} from "~/pages/common/Page";
import {useRates} from "~/providers/items_providers";
import {RatePostFormProvider} from "~/forms/rate/RatePostFormContext";
import {RateList} from "~/lists/RateList";

export default function RatesPage() {
    const [rates, setRates] = useRates()
    return <Page
        pageParams={{
            title: RATES_PAGE_TITLE,
            description: RATES_PAGE_DESCRIPTION,
            breadcrumbs: RATES_BREADCRUMBS,
        }}
    >
        <RatePostFormProvider>
            <RateList rates={rates} onChange={setRates}/>
        </RatePostFormProvider>
    </Page>
}
