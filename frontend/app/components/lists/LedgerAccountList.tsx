import {LedgerAccountPostForm} from "~/components/forms/LedgerAccountPostForm";
import {
    LEDGER_ACCOUNT_HREF,
    LEDGER_ACCOUNTS_ADD_ITEM_MODAL_TITLE,
    LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_TITLE
} from "~/strings";
import {type Column, type SearchKeys, type SortBy} from "~/components/controls/item_list/ItemList";
import {
    deleteItemRouteLedgerAccountsItemIdDelete,
    type LedgerAccountGet,
    postItemRouteLedgerAccountsPost
} from "~/client";
import {validateLedgerAccountPost} from "~/lib/validators";
import {getLedgerAccountPageParams} from "~/routes/LedgerAccount";
import {CollectionList} from "~/components/controls/CollectionList";

const ACCOUNT_NAME_COLUMN: Column<LedgerAccountGet> = {
    heading: "Account name",
    hasLink: true,
    compare: (a, b) => a.account_name.localeCompare(b.account_name),
    render: item => item.account_name
}

const NAME_COLUMN: Column<LedgerAccountGet> = {
    heading: "Name",
    hasLink: false,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const DESCRIPTION_COLUMN: Column<LedgerAccountGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => a.description.localeCompare(b.description),
    render: item => item.description
}

const COLUMNS = [ACCOUNT_NAME_COLUMN, NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<LedgerAccountGet>[] = [{
    column: ACCOUNT_NAME_COLUMN,
    reversed: false,
}, {
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<LedgerAccountGet>[] = ["account_name", "name", "description"]


export function LedgerAccountList({parent, items}: { parent?: LedgerAccountGet, items: LedgerAccountGet[] }) {
    return <CollectionList
        columns={COLUMNS}
        searchFields={SEARCH_FIELDS}
        defaultSortBy={DEFAULT_SORT_BY}
        getItemPageParams={getLedgerAccountPageParams}
        itemHref={LEDGER_ACCOUNT_HREF}
        items={items}
        onPost={postItemRouteLedgerAccountsPost}
        onDelete={deleteItemRouteLedgerAccountsItemIdDelete}
        onValidate={validateLedgerAccountPost}
        addItemModalTitle={LEDGER_ACCOUNTS_ADD_ITEM_MODAL_TITLE}
        addItemModalDefaultPost={{
            parent_id: parent?.id,
            name: "",
            account_name: "",
            description: "",
        }}
        confirmDeleteItemModalTitle={LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_TITLE}
        confirmDeleteItemModalPrompt={LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_PROMPT}
    >
        <LedgerAccountPostForm/>
    </CollectionList>
}