import {Page} from "~/pages/Page";
import {BandedRateList} from "~/lists/rates/BandedRateList";
import {BANDED_RATE_PARAMS} from "~/page_params/rates";
import {BandedRatePostFormProvider} from "~/forms/rate/contexts";
import {useBandedRates} from "~/providers/typed_items_providers";

export function BandedRatesPage() {
    const [rates, setRates] = useBandedRates()
    return <Page
        pageParams={{
            title: BANDED_RATE_PARAMS.collectionPageTitle,
            description: BANDED_RATE_PARAMS.collectionPageDescription,
            breadcrumbs: BANDED_RATE_PARAMS.collectionBreadcrumbs,
        }}
    >
        <BandedRatePostFormProvider>
            <BandedRateList rates={rates} onChange={setRates}/>
        </BandedRatePostFormProvider>
    </Page>
}
