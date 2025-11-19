import {useDisclosure} from "@mantine/hooks";
import {ValuesProvider} from "~/providers/items_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import ValuesPage from "~/pages/ValuesPage";

export default function Values() {
    const [loadingRates, {open: startLoadingRates, close: stopLoadingRates}] = useDisclosure()
    return <LoadingProvider loading={loadingRates}>
        <ValuesProvider
            onBegin={startLoadingRates}
            onEnd={stopLoadingRates}
        >
            <ValuesPage/>
        </ValuesProvider>
    </LoadingProvider>
}
