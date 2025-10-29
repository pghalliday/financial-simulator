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
    type LedgerAccountBankAccountGet,
    type LedgerAccountGet,
    type LedgerAccountPost,
    postItemRouteLedgerAccountsPost
} from "~/client";
import {validateLedgerAccountPost} from "~/lib/validators";
import {getLedgerAccountPageParams} from "~/routes/LedgerAccount";
import {useRef} from "react";
import {Collection, type CollectionRef} from "~/components/controls/Collection";
import type {Impact} from "~/components/modals/ConfirmDeleteModal";

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
                const subLedgerAccounts: LedgerAccountGet[] = []
                const bankAccounts: LedgerAccountBankAccountGet[] = []

                function listDependents(subAccounts: LedgerAccountGet[]) {
                    for (const subAccount of subAccounts) {
                        subLedgerAccounts.push(subAccount)
                        bankAccounts.push(...subAccount.bank_account_asset_accounts)
                        bankAccounts.push(...subAccount.bank_account_interest_income_accounts)
                        bankAccounts.push(...subAccount.bank_account_interest_receivable_accounts)
                        bankAccounts.push(...subAccount.bank_account_fee_expenses_accounts)
                        bankAccounts.push(...subAccount.bank_account_fees_payable_accounts)
                        listDependents(subAccount.sub_accounts)
                    }
                }

                listDependents(item.sub_accounts)
                const dependents: Impact = {}
                if (bankAccounts.length > 0) {
                    dependents["Bank accounts"] = {}
                    for (const bankAccount of bankAccounts) {
                        dependents["Bank accounts"][bankAccount.id] = bankAccount.name
                    }
                }
                if (subLedgerAccounts.length > 0) {
                    dependents["Sub ledger accounts"] = {}
                    for (const sub_ledger_account of subLedgerAccounts) {
                        dependents["Sub ledger accounts"][sub_ledger_account.id] = sub_ledger_account.name
                    }
                }
                collection.current?.startDeleteItem(item, dependents)
            }}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}