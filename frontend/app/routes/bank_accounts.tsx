import {CollectionPage} from "~/components/pages/CollectionPage";
import {
    BANK_ACCOUNT_HREF,
    BANK_ACCOUNTS_HREF,
    BANK_ACCOUNTS_LABEL,
    BANK_ACCOUNTS_PAGE_DESCRIPTION,
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_PAGE_DESCRIPTION,
    PAGE_TITLE
} from "~/strings";
import {
    deleteItemRouteBankAccountsItemIdDelete,
    getItemsRouteBankAccountsGet,
    postItemRouteBankAccountsPost,
    type ScenarioPost
} from "~/client";

const COLLECTION_TITLE = PAGE_TITLE(BANK_ACCOUNTS_PAGE_DESCRIPTION);
const BREADCRUMBS = [
    {
        title: COMPARE_SCENARIOS_PAGE_DESCRIPTION,
        href: COMPARE_SCENARIOS_HREF,
    },
    {
        title: BANK_ACCOUNTS_PAGE_DESCRIPTION,
        href: BANK_ACCOUNTS_HREF,
    },
];

export default function Entities() {
    return <CollectionPage
        collectionTitle={COLLECTION_TITLE}
        collectionDescription={BANK_ACCOUNTS_PAGE_DESCRIPTION}
        collectionLabel={BANK_ACCOUNTS_LABEL}
        itemHref={BANK_ACCOUNT_HREF}
        breadcrumbs={BREADCRUMBS}
        getItems={getItemsRouteBankAccountsGet}
        postItem={(toAddData) => postItemRouteBankAccountsPost({
            // TODO: can we properly type toAddData?
            body: toAddData as ScenarioPost,
        })}
        deleteItem={(itemId) => deleteItemRouteBankAccountsItemIdDelete({
            path: {
                item_id: itemId,
            }
        })}
    />
}
