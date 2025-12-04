import {ItemPageForm} from "~/pages/ItemPageForm";
import {type LedgerAccountGet, type LedgerAccountPost, postItemRouteLedgerAccountsPost} from "../../../../client";
import {useDisclosure} from "@mantine/hooks";
import {BankAccountPostForm} from "~/forms/bank_account/BankAccountPostForm";
import {useBankAccountPostFormContext} from "~/forms/bank_account/contexts";
import {AddLedgerAccountModal} from "~/modals/AddItemModal/ledger_accounts/AddLedgerAccountModal";
import {useTreePost} from "~/hooks/useTreePost";
import {useBankAccount} from "~/providers/item_providers";
import {useLedgerAccountTree} from "~/providers/tree_providers";
import {Modal, useModalsStack} from "@mantine/core";
import {useLedgerAccountPostFormContext} from "~/forms/ledger_account/contexts";

export function BankAccountPageForms() {
    const bankAccountPostForm = useBankAccountPostFormContext()
    const ledgerAccountPostForm = useLedgerAccountPostFormContext()
    const stack = useModalsStack(["add-ledger-account"])
    const [_bankAccount, putBankAccount] = useBankAccount({
        onPutSuccess: (bankAccount) => {
            bankAccountPostForm.setInitialValues(bankAccount)
        }
    })
    const [ledgerAccountTree, setLedgerAccountTree] = useLedgerAccountTree()
    const [addingLedgerAccount, {open: startAddingLedgerAccount, close: stopAddingLedgerAccount}] = useDisclosure()

    const postLedgerAccount = useTreePost<LedgerAccountPost, LedgerAccountGet>({
        treeData: ledgerAccountTree,
        onPostSuccess: (ledgerAccountTree) => {
            stack.close("add-ledger-account")
            setLedgerAccountTree(ledgerAccountTree)
        },
        onPost: postItemRouteLedgerAccountsPost,
        onBeginPost: startAddingLedgerAccount,
        onEndPost: stopAddingLedgerAccount,
    })

    return <>
        <Modal.Stack>
            <AddLedgerAccountModal
                {...stack.register("add-ledger-account")}
                working={addingLedgerAccount}
                onSubmit={postLedgerAccount}
                onCancel={() => stack.close("add-ledger-account")}
            />
        </Modal.Stack>
        <ItemPageForm
            onSubmit={bankAccountPostForm.onSubmit(putBankAccount)}
            onReset={bankAccountPostForm.onReset}
        >
            <BankAccountPostForm
                ledgerAccountTree={ledgerAccountTree}
                onAddLedgerAccount={(initialValues) => {
                    ledgerAccountPostForm.setInitialValues(initialValues)
                    ledgerAccountPostForm.reset()
                    stack.open("add-ledger-account")
                }}
            />
        </ItemPageForm>
    </>
}
