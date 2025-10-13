import type {Route} from "./+types/entity";
import {
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_PAGE_DESCRIPTION,
    ENTITIES_HREF,
    ENTITIES_PAGE_DESCRIPTION,
    ENTITY_HREF,
    ENTITY_PAGE_DESCRIPTION,
    PAGE_TITLE
} from "~/strings";
import {getItemEntitiesItemIdGet} from "~/client";
import {ItemPage} from "~/components/ItemPage";

export default function Entity({params}: Route.ComponentProps) {
    return <ItemPage
        itemId={params.entityId}
        getItem={itemId => getItemEntitiesItemIdGet({
            path: {
                item_id: itemId,
            },
        })}
        getTitle={(itemId, itemName) => {
            return PAGE_TITLE(ENTITY_PAGE_DESCRIPTION(itemName === null ? itemId : itemName))
        }}
        getDescription={(itemId, itemName) => {
            return ENTITY_PAGE_DESCRIPTION(itemName === null ? itemId : itemName)
        }}
        getBreadcrumbs={(itemId, itemName) => {
            return [
                {
                    title: COMPARE_SCENARIOS_PAGE_DESCRIPTION,
                    href: COMPARE_SCENARIOS_HREF,
                },
                {
                    title: ENTITIES_PAGE_DESCRIPTION,
                    href: ENTITIES_HREF,
                },
                {
                    title: itemName === null ? itemId : itemName,
                    href: ENTITY_HREF(itemId),
                },
            ]
        }}
    />
}
