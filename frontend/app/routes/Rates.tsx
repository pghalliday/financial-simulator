import {useDisclosure} from "@mantine/hooks";
import {RatesProvider} from "~/providers/items_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import RatesPage from "~/pages/RatesPage";

export default function Rates() {
    const [loadingRates, {open: startLoadingRates, close: stopLoadingRates}] = useDisclosure()
    return <LoadingProvider loading={loadingRates}>
        <RatesProvider
            onBegin={startLoadingRates}
            onEnd={stopLoadingRates}
        >
            <RatesPage/>
        </RatesProvider>
    </LoadingProvider>
}
