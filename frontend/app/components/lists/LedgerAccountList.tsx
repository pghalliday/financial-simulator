import {LedgerAccountPostForm} from "~/components/forms/LedgerAccountPostForm";
import {
    LEDGER_ACCOUNT_HREF,
    LEDGER_ACCOUNTS_ADD_ITEM_MODAL_TITLE,
    LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_TITLE
} from "~/strings";
import {type Column, ItemList, type SearchKeys, type SortBy} from "~/components/controls/item_list/ItemList";
import {
    deleteItemRouteLedgerAccountsItemIdDelete,
    type LedgerAccountGet,
    type LedgerAccountPost,
    postItemRouteLedgerAccountsPost
} from "~/client";
import {validateLedgerAccountPost} from "~/lib/validators";
import {getLedgerAccountPageParams} from "~/routes/LedgerAccount";
import {useRef} from "react";
import {Collection, type CollectionRef} from "~/components/controls/Collection";

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


export function LedgerAccountList({parent, items, setItems}: {
    parent?: LedgerAccountGet,
    items: LedgerAccountGet[],
    setItems: (items: LedgerAccountGet[]) => void,
}) {
    const collection = useRef<CollectionRef<LedgerAccountGet, LedgerAccountPost>>(null)
    return <>
        <Collection
            ref={collection}
            items={items}
            setItems={setItems}
            onPost={postItemRouteLedgerAccountsPost}
            onDelete={deleteItemRouteLedgerAccountsItemIdDelete}
            onValidate={validateLedgerAccountPost}
            addItemModalTitle={LEDGER_ACCOUNTS_ADD_ITEM_MODAL_TITLE}
            confirmDeleteItemModalTitle={LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_TITLE}
            confirmDeleteItemModalPrompt={LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_PROMPT}
        >
            <LedgerAccountPostForm/>
        </Collection>
        <ItemList
            columns={COLUMNS}
            items={items}
            getItemPageParams={getLedgerAccountPageParams}
            href={LEDGER_ACCOUNT_HREF}
            onAdd={() => collection.current?.startAddItem({
                parent_id: parent?.id,
                name: "",
                account_name: "",
                description: "",
            })}
            onDelete={(item) => {
                function listDependents(ledgerAccount: LedgerAccountGet) {
                    console.log(ledgerAccount)
                    console.log(ledgerAccount.bank_account_asset_accounts)
                    console.log(ledgerAccount.bank_account_interest_income_accounts)
                    console.log(ledgerAccount.bank_account_interest_receivable_accounts)
                    console.log(ledgerAccount.bank_account_fee_expenses_accounts)
                    console.log(ledgerAccount.bank_account_fees_payable_accounts)
                    for (const subAccount of ledgerAccount.sub_accounts) {
                        listDependents(subAccount)
                    }
                }

                listDependents(item)
                collection.current?.startDeleteItem(item)
            }}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}