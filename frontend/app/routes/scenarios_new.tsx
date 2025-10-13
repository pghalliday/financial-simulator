import {CollectionPage} from "~/components/CollectionPage";
import {
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_NAME,
    SCENARIO_HREF,
    SCENARIOS_HREF,
    SCENARIOS_NAME,
    TITLE
} from "~/strings";
import {
    deleteItemScenariosItemIdDelete,
    getItemsScenariosGet,
    postItemScenariosPost,
    type ScenarioPost
} from "~/client";

const COLLECTION_TITLE = TITLE(SCENARIOS_NAME);
const BREADCRUMBS = [
    {
        title: COMPARE_SCENARIOS_NAME,
        href: COMPARE_SCENARIOS_HREF,
    },
    {
        title: SCENARIOS_NAME,
        href: SCENARIOS_HREF,
    },
];

export default function Entities() {
    return <CollectionPage
        collectionTitle={COLLECTION_TITLE}
        collectionDescription={SCENARIOS_NAME}
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
