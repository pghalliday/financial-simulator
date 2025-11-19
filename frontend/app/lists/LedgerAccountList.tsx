import {
    LEDGER_ACCOUNT_HREF,
    LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_PROMPT,
    LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_TITLE
} from "~/strings";
import {
    type Column,
    type SearchKeys,
    SearchSortList,
    type SortBy
} from "~/components/controls/SearchSortList/SearchSortList";
import {
    deleteItemRouteLedgerAccountsItemIdDelete,
    type LedgerAccountBankAccountGet,
    type LedgerAccountGet,
    type LedgerAccountParentGet,
    type LedgerAccountPost,
    postItemRouteLedgerAccountsPost
} from "../../client";
import {getLedgerAccountPageParams} from "~/routes/LedgerAccount";
import {type ReactElement, useCallback, useState} from "react";
import {ConfirmDeleteModal, type Impact} from "~/modals/ConfirmDeleteModal/ConfirmDeleteModal";
import {useListPost} from "~/lib/hooks/useListPost";
import {useDisclosure} from "@mantine/hooks";
import {AddLedgerAccountModal} from "~/modals/AddItemModal/AddLedgerAccountModal";
import {useListDelete} from "~/lib/hooks/useListDelete";
import {Modal, useModalsStack} from "@mantine/core";
import {useLedgerAccountPostFormContext} from "~/forms/ledger_account/LedgerAccountPostFormContext";

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
    compare: (a, b) => (a.description || "").localeCompare(b.description || ""),
    render: item => item.description || ""
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

export interface Props {
    parent?: LedgerAccountParentGet
    ledgerAccounts?: LedgerAccountGet[]
    onChange?: (items: LedgerAccountGet[]) => void
}

export function LedgerAccountList(
    {
        parent,
        ledgerAccounts = [],
        onChange = () => {
        },
    }: Props
) {
    const stack = useModalsStack(["add-ledger-account", "confirm-delete"])
    const form = useLedgerAccountPostFormContext()
    const [addingItem, {open: startAddingItem, close: stopAddingItem}] = useDisclosure()
    const [confirmDeletePrompt, setConfirmDeletePrompt] = useState<ReactElement>(<p/>)
    const [confirmDeleteDependents, setConfirmDeleteDependents] = useState<Impact>({})
    const [confirmDeleteReferences, setConfirmDeleteReferences] = useState<Impact>({})
    const [deletingItem, {open: startDeletingItem, close: stopDeletingItem}] = useDisclosure()

    const postItem = useListPost<LedgerAccountPost, LedgerAccountGet>({
        items: ledgerAccounts,
        onPostSuccess: (items) => {
            stack.close("add-ledger-account")
            onChange(items)
        },
        onPost: postItemRouteLedgerAccountsPost,
        onBeginPost: startAddingItem,
        onEndPost: stopAddingItem,
    })

    const {setToDelete, deleteItem} = useListDelete<LedgerAccountPost, LedgerAccountGet>({
        items: ledgerAccounts,
        onDeleteSuccess: (items) => {
            stack.close("confirm-delete")
            onChange(items)
        },
        onDelete: deleteItemRouteLedgerAccountsItemIdDelete,
        onBeginDelete: startDeletingItem,
        onEndDelete: stopDeletingItem,
    })

    const onAdd = useCallback(() => {
        const initialValues = {
            parent_id: parent?.id,
            name: "",
            account_name: "",
            description: "",
        }
        form.setInitialValues(initialValues)
        form.reset()
        stack.open("add-ledger-account")
    }, [])

    const onDelete = useCallback((item: LedgerAccountGet) => {
        const subLedgerAccounts: LedgerAccountGet[] = []
        const bankAccounts: LedgerAccountBankAccountGet[] = []

        function listDependents(account: LedgerAccountGet) {
            bankAccounts.push(...account.bank_account_asset_accounts)
            bankAccounts.push(...account.bank_account_interest_income_accounts)
            bankAccounts.push(...account.bank_account_interest_receivable_accounts)
            bankAccounts.push(...account.bank_account_fee_expenses_accounts)
            bankAccounts.push(...account.bank_account_fees_payable_accounts)
            for (const subAccount of account.sub_accounts) {
                subLedgerAccounts.push(subAccount)
                listDependents(subAccount)
            }
        }

        listDependents(item)
        const dependents: Impact = {}
        const references: Impact = {}
        if (bankAccounts.length > 0) {
            references["Bank accounts"] = {}
            for (const bankAccount of bankAccounts) {
                references["Bank accounts"][bankAccount.id] = bankAccount.name
            }
        }
        if (subLedgerAccounts.length > 0) {
            dependents["Sub ledger accounts"] = {}
            for (const sub_ledger_account of subLedgerAccounts) {
                dependents["Sub ledger accounts"][sub_ledger_account.id] = sub_ledger_account.name
            }
        }
        setToDelete(item)
        setConfirmDeletePrompt(LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_PROMPT(item))
        setConfirmDeleteDependents(dependents)
        setConfirmDeleteReferences(references)
        stack.open("confirm-delete")
    }, [setToDelete])

    return <>
        <Modal.Stack>
            <AddLedgerAccountModal
                {...stack.register("add-ledger-account")}
                working={addingItem}
                onSubmit={postItem}
                onCancel={() => stack.close("add-ledger-account")}
            />
            <ConfirmDeleteModal
                {...stack.register("confirm-delete")}
                working={deletingItem}
                title={LEDGER_ACCOUNTS_CONFIRM_DELETE_ITEM_MODAL_TITLE}
                prompt={confirmDeletePrompt}
                dependents={confirmDeleteDependents}
                references={confirmDeleteReferences}
                onConfirm={deleteItem}
                onCancel={() => stack.close("confirm-delete")}
            />
        </Modal.Stack>
        <SearchSortList
            columns={COLUMNS}
            items={ledgerAccounts}
            getItemPageParams={getLedgerAccountPageParams}
            href={LEDGER_ACCOUNT_HREF}
            onAdd={onAdd}
            onDelete={onDelete}
            searchFields={SEARCH_FIELDS}
            defaultSortBy={DEFAULT_SORT_BY}
        />
    </>
}