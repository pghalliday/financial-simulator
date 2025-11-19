import type {Route} from "./+types/Value";
import {VALUE_BREADCRUMBS, VALUE_PAGE_DESCRIPTION, VALUE_PAGE_TITLE} from "~/strings";
import {useDisclosure} from "@mantine/hooks";
import type {ItemPageParams} from "~/lib/hooks/useItemPageParams";
import type {ValueGet} from "~/lib/types";
import {ValueProvider} from "~/providers/item_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import ValuePage from "~/pages/ValuePage/ValuePage";

export function getValuePageParams(item: ValueGet): ItemPageParams {
    return {
        id: item.id,
        name: item.name,
    }
}

export default function Value({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <ValueProvider
            itemId={itemId}
            itemPageTitle={VALUE_PAGE_TITLE}
            itemPageDescription={VALUE_PAGE_DESCRIPTION}
            itemBreadcrumbs={VALUE_BREADCRUMBS}
            getItemPageParams={getValuePageParams}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <ValuePage/>
        </ValueProvider>
    </LoadingProvider>
}
