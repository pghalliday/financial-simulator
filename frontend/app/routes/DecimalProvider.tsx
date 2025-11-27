import type {Route} from "./+types/DecimalProvider";
import {DECIMAL_PROVIDER_BREADCRUMBS, DECIMAL_PROVIDER_PAGE_DESCRIPTION, DECIMAL_PROVIDER_PAGE_TITLE} from "~/strings";
import {useDisclosure} from "@mantine/hooks";
import type {ItemPageParams} from "~/lib/hooks/useItemPageParams";
import type {DecimalProviderGet} from "~/lib/types";
import {DecimalProviderProvider} from "~/providers/item_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import DecimalProviderPage from "~/pages/DecimalProviderPage/DecimalProviderPage";
import {DecimalProvidersProvider, SchedulesProvider} from "~/providers/items_providers";

export function getDecimalProviderPageParams(item: DecimalProviderGet): ItemPageParams {
    return {
        id: item.id,
        name: item.name,
    }
}

export default function DecimalProvider({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [loadingDecimalProviders, {
        open: startLoadingDecimalProviders,
        close: stopLoadingDecimalProviders,
    }] = useDisclosure()
    const [loadingSchedules, {
        open: startLoadingSchedules,
        close: stopLoadingSchedules,
    }] = useDisclosure()
    return <LoadingProvider loading={
        loading ||
        loadingDecimalProviders ||
        loadingSchedules
    }>
        <DecimalProviderProvider
            itemId={itemId}
            itemPageTitle={DECIMAL_PROVIDER_PAGE_TITLE}
            itemPageDescription={DECIMAL_PROVIDER_PAGE_DESCRIPTION}
            itemBreadcrumbs={DECIMAL_PROVIDER_BREADCRUMBS}
            getItemPageParams={getDecimalProviderPageParams}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <DecimalProvidersProvider
                onBegin={startLoadingDecimalProviders}
                onEnd={stopLoadingDecimalProviders}
            >
                <SchedulesProvider
                    onBegin={startLoadingSchedules}
                    onEnd={stopLoadingSchedules}
                >
                    <DecimalProviderPage/>
                </SchedulesProvider>
            </DecimalProvidersProvider>
        </DecimalProviderProvider>
    </LoadingProvider>
}
