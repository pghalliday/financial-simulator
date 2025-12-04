import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {FromSchedulesPage} from "~/pages/schedules/collections/FromSchedulesPage";
import {FromSchedulesProvider} from "~/providers/typed_items_providers";

export default function FromSchedules() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <FromSchedulesProvider
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <FromSchedulesPage/>
        </FromSchedulesProvider>
    </LoadingProvider>
}
