import type {Route} from "./+types/BankAccount";
import {
    BANK_ACCOUNT_HREF,
    BANK_ACCOUNT_PAGE_DESCRIPTION,
    BANK_ACCOUNTS_HREF,
    BANK_ACCOUNTS_PAGE_DESCRIPTION
} from "~/strings";
import {ItemPageForm} from "~/components/pages/ItemPage/ItemPageForm";
import {useState} from "react";
import {
    type BankAccountGet,
    type BankAccountPost,
    getItemRouteBankAccountsItemIdGet,
    putItemRouteBankAccountsItemIdPut
} from "~/client";
import {useDisclosure} from "@mantine/hooks";
import {useItemPage} from "~/lib/hooks/useItemPage";
import {Page} from "~/components/pages/Page";
import {validateBankAccountPost} from "~/lib/validators";
import {BankAccountPostForm} from "~/components/forms/BankAccountPostForm";


export default function BankAccount({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [revertDisabled, setRevertDisabled] = useState(true)
    const [saveDisabled, setSaveDisabled] = useState(true)

    const {
        getField,
        setField,
        revert,
        submit,
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
        validateBankAccountPost,
    )

    return <Page
        title={pageTitle}
        description={pageDescription}
        breadcrumbs={pageBreadcrumbs}
        loading={loading}
    >
        <ItemPageForm
            onRevert={revert}
            revertDisabled={revertDisabled}
            onSave={submit}
            saveDisabled={saveDisabled}
        >
            <BankAccountPostForm getField={getField} setField={setField}/>
        </ItemPageForm>
    </Page>
}
