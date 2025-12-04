import {Page} from "~/pages/Page";
import {ContinuousRateList} from "~/lists/rates/ContinuousRateList";
import {CONTINUOUS_RATE_PARAMS} from "~/page_params/rates";
import {ContinuousRatePostFormProvider} from "~/forms/rate/contexts";
import {useContinuousRates} from "~/providers/items_providers";

export function ContinuousRatesPage() {
    const [rates, setRates] = useContinuousRates()
    return <Page
        pageParams={{
            title: CONTINUOUS_RATE_PARAMS.collectionPageTitle,
            description: CONTINUOUS_RATE_PARAMS.collectionPageDescription,
            breadcrumbs: CONTINUOUS_RATE_PARAMS.collectionBreadcrumbs,
        }}
    >
        <ContinuousRatePostFormProvider>
            <ContinuousRateList rates={rates} onChange={setRates}/>
        </ContinuousRatePostFormProvider>
    </Page>
}
