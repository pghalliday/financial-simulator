import type {Route} from "./+types/BankAccount";
import {
    BANK_ACCOUNT_HREF,
    BANK_ACCOUNT_PAGE_DESCRIPTION,
    BANK_ACCOUNTS_HREF,
    BANK_ACCOUNTS_PAGE_DESCRIPTION
} from "~/strings";
import {ItemPage} from "~/components/pages/ItemPage/ItemPage";
import {ItemPageForm} from "~/components/pages/ItemPage/ItemPageForm";
import {useState} from "react";
import {
    type BankAccountGet,
    type BankAccountPost,
    getItemRouteBankAccountsItemIdGet,
    putItemRouteBankAccountsItemIdPut
} from "~/client";
import {useDisclosure} from "@mantine/hooks";
import {ItemTextInput} from "~/components/controls/ItemTextInput";
import {useItemPage} from "~/lib/hooks/useItemPage";

export default function BankAccount({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [revertDisabled, setRevertDisabled] = useState(true)
    const [saveDisabled, setSaveDisabled] = useState(true)

    const {
        getItemPostField,
        setItemPostField,
        revert,
        save,
        pageTitle,
        pageDescription,
        pageBreadcrumbs,
    } = useItemPage<BankAccountPost, BankAccountGet>(
        getItemRouteBankAccountsItemIdGet,
        putItemRouteBankAccountsItemIdPut,
        itemId,
        BANK_ACCOUNTS_PAGE_DESCRIPTION,
        BANK_ACCOUNTS_HREF,
        BANK_ACCOUNT_PAGE_DESCRIPTION,
        BANK_ACCOUNT_HREF,
        startLoading,
        stopLoading,
        setRevertDisabled,
        setSaveDisabled,
        (itemPost) => itemPost.name !== ""
    )

    return <ItemPage
        title={pageTitle}
        description={pageDescription}
        breadcrumbs={pageBreadcrumbs}
        loading={loading}
    >
        <ItemPageForm
            onRevert={revert}
            revertDisabled={revertDisabled}
            onSave={save}
            saveDisabled={saveDisabled}
        >
            <ItemTextInput<BankAccountPost, "name">
                field="name"
                getField={getItemPostField}
                setField={setItemPostField}
                label="Name"
                description={"Bank account name"}
                placeholder="Name"
                required
            />
            <ItemTextInput<BankAccountPost, "description">
                field="description"
                getField={getItemPostField}
                setField={setItemPostField}
                label="Description"
                description={"Bank account description"}
                placeholder="Description"
            />
        </ItemPageForm>
    </ItemPage>
}
