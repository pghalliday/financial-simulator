import type {Route} from "./+types/bank_account";
import {
    BANK_ACCOUNT_HREF,
    BANK_ACCOUNT_PAGE_DESCRIPTION,
    BANK_ACCOUNTS_HREF,
    BANK_ACCOUNTS_LABEL,
    BANK_ACCOUNTS_PAGE_DESCRIPTION,
    COMPARE_SCENARIOS_HREF,
    COMPARE_SCENARIOS_PAGE_DESCRIPTION,
    PAGE_TITLE
} from "~/strings";
import {type BankAccountPost, getItemRouteBankAccountsItemIdGet, putItemRouteBankAccountsItemIdPut} from "~/client";
import {ItemPage} from "~/components/pages/ItemPage";

export default function BankAccount({params}: Route.ComponentProps) {
    return <ItemPage
        itemId={params.bankAccountId}
        collectionLabel={BANK_ACCOUNTS_LABEL}
        getItem={itemId => getItemRouteBankAccountsItemIdGet({
            path: {
                item_id: itemId,
            },
        })}
        putItem={(itemId, data) => putItemRouteBankAccountsItemIdPut({
            path: {
                item_id: itemId,
            },
            // TODO: can we properly type data?
            body: data as BankAccountPost,
        })}
        getTitle={(itemId, itemName) => {
            return PAGE_TITLE(BANK_ACCOUNT_PAGE_DESCRIPTION(itemName === null ? itemId : itemName))
        }}
        getDescription={(itemId, itemName) => {
            return BANK_ACCOUNT_PAGE_DESCRIPTION(itemName === null ? itemId : itemName)
        }}
        getBreadcrumbs={(itemId, itemName) => {
            return [
                {
                    title: COMPARE_SCENARIOS_PAGE_DESCRIPTION,
                    href: COMPARE_SCENARIOS_HREF,
                },
                {
                    title: BANK_ACCOUNTS_PAGE_DESCRIPTION,
                    href: BANK_ACCOUNTS_HREF,
                },
                {
                    title: itemName === null ? itemId : itemName,
                    href: BANK_ACCOUNT_HREF(itemId),
                },
            ]
        }}
        relations={[]}
    />
}
