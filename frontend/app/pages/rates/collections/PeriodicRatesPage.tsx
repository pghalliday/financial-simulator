import {Page} from "~/pages/Page";
import {PeriodicRateList} from "~/lists/rates/PeriodicRateList";
import {PERIODIC_RATE_PARAMS} from "~/page_params/rates";
import {PeriodicRatePostFormProvider} from "~/forms/rate/contexts";
import {usePeriodicRates} from "~/providers/items_providers";

export function PeriodicRatesPage() {
    const [rates, setRates] = usePeriodicRates()
    return <Page
        pageParams={{
            title: PERIODIC_RATE_PARAMS.collectionPageTitle,
            description: PERIODIC_RATE_PARAMS.collectionPageDescription,
            breadcrumbs: PERIODIC_RATE_PARAMS.collectionBreadcrumbs,
        }}
    >
        <PeriodicRatePostFormProvider>
            <PeriodicRateList rates={rates} onChange={setRates}/>
        </PeriodicRatePostFormProvider>
    </Page>
}
