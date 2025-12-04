import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {UntilSchedulesPage} from "~/pages/schedules/collections/UntilSchedulesPage";
import {UntilSchedulesProvider} from "~/providers/typed_items_providers";

export default function UntilSchedules() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <UntilSchedulesProvider
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <UntilSchedulesPage/>
        </UntilSchedulesProvider>
    </LoadingProvider>
}
