import type {Route} from "./+types/scenario";
import {
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_PAGE_DESCRIPTION,
    PAGE_TITLE,
    SCENARIO_HREF,
    SCENARIO_PAGE_DESCRIPTION,
    SCENARIOS_HREF,
    SCENARIOS_LABEL,
    SCENARIOS_PAGE_DESCRIPTION
} from "~/strings";
import {
    deleteRelatedItemScenariosItemIdEntitiesRelatedItemIdDelete,
    getItemScenariosItemIdGet,
    getItemsEntitiesGet,
    getRelatedItemsScenariosItemIdEntitiesGet,
    postRelatedItemScenariosItemIdEntitiesPost,
    putItemScenariosItemIdPut,
    type ScenarioPost
} from "~/client";
import {ItemPage} from "~/components/pages/ItemPage";

export default function Scenario({params}: Route.ComponentProps) {
    return <ItemPage
        itemId={params.scenarioId}
        collectionLabel={SCENARIOS_LABEL}
        getItem={itemId => getItemScenariosItemIdGet({
            path: {
                item_id: itemId,
            },
        })}
        putItem={(itemId, data) => putItemScenariosItemIdPut({
            path: {
                item_id: itemId,
            },
            // TODO: can we properly type data?
            body: data as ScenarioPost,
        })}
        getTitle={(itemId, itemName) => {
            return PAGE_TITLE(SCENARIO_PAGE_DESCRIPTION(itemName === null ? itemId : itemName))
        }}
        getDescription={(itemId, itemName) => {
            return SCENARIO_PAGE_DESCRIPTION(itemName === null ? itemId : itemName)
        }}
        getBreadcrumbs={(itemId, itemName) => {
            return [
                {
                    title: COMPARE_SCENARIOS_PAGE_DESCRIPTION,
                    href: COMPARE_SCENARIOS_HREF,
                },
                {
                    title: SCENARIOS_PAGE_DESCRIPTION,
                    href: SCENARIOS_HREF,
                },
                {
                    title: itemName === null ? itemId : itemName,
                    href: SCENARIO_HREF(itemId),
                },
            ]
        }}
        relations={[{
            itemId: params.scenarioId,
            name: "entities",
            label: "entities",
            getOptions: getItemsEntitiesGet,
            getSelected: (itemId) => getRelatedItemsScenariosItemIdEntitiesGet({
                path: {
                    item_id: itemId,
                },
            }),
            select: (itemId, relatedItemId) => postRelatedItemScenariosItemIdEntitiesPost({
                path: {
                    item_id: itemId,
                },
                body: {
                    id: relatedItemId,
                },
            }),
            deselect: (itemId, relatedItemId) => deleteRelatedItemScenariosItemIdEntitiesRelatedItemIdDelete({
                path: {
                    item_id: itemId,
                    related_item_id: relatedItemId,
                },
            }),
        }]}
    />
}
