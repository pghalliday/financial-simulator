import {CollectionPageOld} from "~/components/pages/CollectionPageOld";
import {
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_PAGE_DESCRIPTION,
    PAGE_TITLE,
    SCENARIO_HREF,
    SCENARIOS_HREF,
    SCENARIOS_LABEL,
    SCENARIOS_PAGE_DESCRIPTION
} from "~/strings";
import {
    deleteItemRouteScenariosItemIdDelete,
    getItemsRouteScenariosGet,
    postItemRouteScenariosPost,
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
    return <CollectionPageOld
        collectionTitle={COLLECTION_TITLE}
        collectionDescription={SCENARIOS_PAGE_DESCRIPTION}
        collectionLabel={SCENARIOS_LABEL}
        itemHref={SCENARIO_HREF}
        breadcrumbs={BREADCRUMBS}
        getItems={getItemsRouteScenariosGet}
        postItem={(toAddData) => postItemRouteScenariosPost({
            // TODO: can we properly type toAddData?
            body: toAddData as ScenarioPost,
        })}
        deleteItem={(itemId) => deleteItemRouteScenariosItemIdDelete({
            path: {
                item_id: itemId,
            }
        })}
    />
}
