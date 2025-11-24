import type {Route} from "./+types/RateProvider";
import {RATE_PROVIDER_BREADCRUMBS, RATE_PROVIDER_PAGE_DESCRIPTION, RATE_PROVIDER_PAGE_TITLE} from "~/strings";
import {useDisclosure} from "@mantine/hooks";
import type {ItemPageParams} from "~/lib/hooks/useItemPageParams";
import type {RateProviderGet} from "~/lib/types";
import {RateProviderProvider} from "~/providers/item_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import RateProviderPage from "~/pages/RateProviderPage/RateProviderPage";

export function getRateProviderPageParams(item: RateProviderGet): ItemPageParams {
    return {
        id: item.id,
        name: item.name,
    }
}

export default function RateProvider({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <RateProviderProvider
            itemId={itemId}
            itemPageTitle={RATE_PROVIDER_PAGE_TITLE}
            itemPageDescription={RATE_PROVIDER_PAGE_DESCRIPTION}
            itemBreadcrumbs={RATE_PROVIDER_BREADCRUMBS}
            getItemPageParams={getRateProviderPageParams}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <RateProviderPage/>
        </RateProviderProvider>
    </LoadingProvider>
}
