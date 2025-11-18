import type {Route} from "./+types/Rate";
import {RATE_BREADCRUMBS, RATE_PAGE_DESCRIPTION, RATE_PAGE_TITLE} from "~/strings";
import {useDisclosure} from "@mantine/hooks";
import type {ItemPageParams} from "~/lib/hooks/useItemPageParams";
import type {RateGet} from "~/lib/types";
import {RateProvider} from "~/providers/item_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import RatePage from "~/pages/RatePage/RatePage";

export function getRatePageParams(item: RateGet): ItemPageParams {
    return {
        id: item.id,
        name: item.name,
    }
}

export default function Rate({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <RateProvider
            itemId={itemId}
            itemPageTitle={RATE_PAGE_TITLE}
            itemPageDescription={RATE_PAGE_DESCRIPTION}
            itemBreadcrumbs={RATE_BREADCRUMBS}
            getItemPageParams={getRatePageParams}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <RatePage/>
        </RateProvider>
    </LoadingProvider>
}
