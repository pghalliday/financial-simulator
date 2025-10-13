import {CollectionPage} from "~/components/CollectionPage";
import {
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_NAME,
    ENTITIES_HREF,
    ENTITIES_NAME,
    ENTITY_HREF,
    ENTITY_TYPES,
    TITLE
} from "~/strings";
import {
    type CorporationEntityPost,
    deleteItemEntitiesItemIdDelete,
    getItemsEntitiesGet,
    type IndividualEntityPost,
    postItemEntitiesPost
} from "~/client";

const COLLECTION_TITLE = TITLE(ENTITIES_NAME);
const BREADCRUMBS = [
    {
        title: COMPARE_SCENARIOS_NAME,
        href: COMPARE_SCENARIOS_HREF,
    },
    {
        title: ENTITIES_NAME,
        href: ENTITIES_HREF,
    },
];

export default function Entities() {
    return <CollectionPage
        collectionTitle={COLLECTION_TITLE}
        collectionDescription={ENTITIES_NAME}
        itemHref={ENTITY_HREF}
        breadcrumbs={BREADCRUMBS}
        itemTypes={ENTITY_TYPES}
        getItems={getItemsEntitiesGet}
        postItem={(toAddData) => postItemEntitiesPost({
            // TODO: can we properly type toAddData?
            body: toAddData as (IndividualEntityPost | CorporationEntityPost),
        })}
        deleteItem={(itemId) => deleteItemEntitiesItemIdDelete({
            path: {
                item_id: itemId,
            }
        })}
    />
}
