import {CollectionPage} from "~/components/CollectionPage";
import {
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_PAGE_DESCRIPTION,
    ENTITIES_HREF,
    ENTITIES_LABEL,
    ENTITIES_PAGE_DESCRIPTION,
    ENTITY_HREF,
    ENTITY_TYPES,
    PAGE_TITLE
} from "~/strings";
import {
    type CorporationEntityPost,
    deleteItemEntitiesItemIdDelete,
    getItemsEntitiesGet,
    type IndividualEntityPost,
    postItemEntitiesPost
} from "~/client";

const COLLECTION_TITLE = PAGE_TITLE(ENTITIES_PAGE_DESCRIPTION);
const BREADCRUMBS = [
    {
        title: COMPARE_SCENARIOS_PAGE_DESCRIPTION,
        href: COMPARE_SCENARIOS_HREF,
    },
    {
        title: ENTITIES_PAGE_DESCRIPTION,
        href: ENTITIES_HREF,
    },
];

export default function Entities() {
    return <CollectionPage
        collectionTitle={COLLECTION_TITLE}
        collectionDescription={ENTITIES_PAGE_DESCRIPTION}
        collectionLabel={ENTITIES_LABEL}
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
