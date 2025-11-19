import type {Route} from "./+types/Provider";
import {PROVIDER_BREADCRUMBS, PROVIDER_PAGE_DESCRIPTION, PROVIDER_PAGE_TITLE} from "~/strings";
import {useDisclosure} from "@mantine/hooks";
import type {ItemPageParams} from "~/lib/hooks/useItemPageParams";
import type {ProviderGet} from "~/lib/types";
import {ProviderProvider} from "~/providers/item_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import ProviderPage from "~/pages/ProviderPage/ProviderPage";

export function getProviderPageParams(item: ProviderGet): ItemPageParams {
    return {
        id: item.id,
        name: item.name,
    }
}

export default function Provider({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <ProviderProvider
            itemId={itemId}
            itemPageTitle={PROVIDER_PAGE_TITLE}
            itemPageDescription={PROVIDER_PAGE_DESCRIPTION}
            itemBreadcrumbs={PROVIDER_BREADCRUMBS}
            getItemPageParams={getProviderPageParams}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <ProviderPage/>
        </ProviderProvider>
    </LoadingProvider>
}
