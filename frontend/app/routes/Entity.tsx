import type {Route} from "./+types/Entity";
import {ENTITY_BREADCRUMBS, ENTITY_PAGE_DESCRIPTION, ENTITY_PAGE_TITLE} from "~/strings";
import {useDisclosure} from "@mantine/hooks";
import type {ItemPageParams} from "~/lib/hooks/useItemPageParams";
import type {EntityGet} from "~/lib/types";
import {EntityProvider} from "~/providers/item_providers";
import EntityPage from "~/pages/EntityPage/EntityPage";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {ScenariosProvider} from "~/providers/items_providers";

export function getEntityPageParams(item: EntityGet): ItemPageParams {
    return {
        id: item.id,
        name: item.name,
    }
}

export default function Entity({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <EntityProvider
            itemId={itemId}
            itemPageTitle={ENTITY_PAGE_TITLE}
            itemPageDescription={ENTITY_PAGE_DESCRIPTION}
            itemBreadcrumbs={ENTITY_BREADCRUMBS}
            getItemPageParams={getEntityPageParams}
            onBegin={startLoading}
            onEnd={stopLoading}
            depth={1}
        >
            <ScenariosProvider>
                <EntityPage/>
            </ScenariosProvider>
        </EntityProvider>
    </LoadingProvider>
}
