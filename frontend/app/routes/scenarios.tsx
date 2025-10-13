import {CollectionPage} from "~/components/CollectionPage";
import {
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_PAGE_DESCRIPTION,
    PAGE_TITLE,
    SCENARIO_HREF,
    SCENARIOS_HREF,
    SCENARIOS_PAGE_DESCRIPTION
} from "~/strings";
import {
    deleteItemScenariosItemIdDelete,
    getItemsScenariosGet,
    postItemScenariosPost,
    type ScenarioPost
} from "~/client";

const COLLECTION_TITLE = PAGE_TITLE(SCENARIOS_PAGE_DESCRIPTION);
const BREADCRUMBS = [
    {
        title: COMPARE_SCENARIOS_PAGE_DESCRIPTION,
        href: COMPARE_SCENARIOS_HREF,
    },
    {
        title: SCENARIOS_PAGE_DESCRIPTION,
        href: SCENARIOS_HREF,
    },
];

export default function Entities() {
    return <CollectionPage
        collectionTitle={COLLECTION_TITLE}
        collectionDescription={SCENARIOS_PAGE_DESCRIPTION}
        itemHref={SCENARIO_HREF}
        breadcrumbs={BREADCRUMBS}
        getItems={getItemsScenariosGet}
        postItem={(toAddData) => postItemScenariosPost({
            // TODO: can we properly type toAddData?
            body: toAddData as ScenarioPost,
        })}
        deleteItem={(itemId) => deleteItemScenariosItemIdDelete({
            path: {
                item_id: itemId,
            }
        })}
    />
}
