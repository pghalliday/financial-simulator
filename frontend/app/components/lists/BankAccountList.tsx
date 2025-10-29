import {
    BANK_ACCOUNT_HREF,
    BANK_ACCOUNTS_ADD_ITEM_MODAL_TITLE,
    BANK_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    BANK_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_TITLE
} from "~/strings";
import {type Column, ItemList, type SearchKeys, type SortBy} from "~/components/controls/item_list/ItemList";
import {
    type BankAccountGet,
    type BankAccountPost,
    deleteItemRouteBankAccountsItemIdDelete,
    postItemRouteBankAccountsPost
} from "~/client";
import {validateBankAccountPost} from "~/lib/validators";
import {getBankAccountPageParams} from "~/routes/BankAccount";
import {BankAccountPostForm} from "~/components/forms/BankAccountPostForm";
import {Collection, type CollectionRef} from "~/components/controls/Collection";
import {useRef} from "react";

const NAME_COLUMN: Column<BankAccountGet> = {
    heading: "Name",
    hasLink: true,
    compare: (a, b) => a.name.localeCompare(b.name),
    render: item => item.name
}

const DESCRIPTION_COLUMN: Column<BankAccountGet> = {
    heading: "Description",
    hasLink: false,
    compare: (a, b) => a.description.localeCompare(b.description),
    render: item => item.description
}

const COLUMNS = [NAME_COLUMN, DESCRIPTION_COLUMN]
const DEFAULT_SORT_BY: SortBy<BankAccountGet>[] = [{
    column: NAME_COLUMN,
    reversed: false,
}, {
    column: DESCRIPTION_COLUMN,
    reversed: false,
}]
const SEARCH_FIELDS: SearchKeys<BankAccountGet>[] = ["name", "description"]

interface BankAccountListProps {
    items: BankAccountGet[],
    setItems: (items: BankAccountGet[]) => void,
    startLoading: () => void,
    stopLoading: () => void,
}

export function BankAccountList({items, setItems, startLoading, stopLoading}: BankAccountListProps) {
    const collection = useRef<CollectionRef<BankAccountGet, BankAccountPost>>(null)
    return <>
        <Collection
            ref={collection}
            items={items}
            setItems={setItems}
            onPost={postItemRouteBankAccountsPost}
            onDelete={deleteItemRouteBankAccountsItemIdDelete}
            onValidate={validateBankAccountPost}
            addItemModalTitle={BANK_ACCOUNTS_ADD_ITEM_MODAL_TITLE}
            confirmDeleteItemModalTitle={BANK_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_TITLE}
            confirmDeleteItemModalPrompt={BANK_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_PROMPT}
        >
            <BankAccountPostForm startLoading={startLoading} stopLoading={stopLoading}/>
        </Collection>
        <ItemList
            columns={COLUMNS}
            items={items}
            getItemPageParams={getBankAccountPageParams}
            href={BANK_ACCOUNT_HREF}
            onAdd={() => collection.current?.startAddItem({
                name: "",
                description: "",
            })}
            onDelete={(item) => collection.current?.startDeleteItem(item)}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}