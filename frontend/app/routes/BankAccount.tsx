import type {Route} from "./+types/BankAccount";
import {BANK_ACCOUNT_BREADCRUMBS, BANK_ACCOUNT_PAGE_DESCRIPTION, BANK_ACCOUNT_PAGE_TITLE} from "~/strings";
import {ItemPageForm} from "~/components/pages/ItemPageForm";
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
import type {ItemPageParams} from "~/lib/hooks/useItemPageParams";
import {GetSetProvider} from "~/components/providers/GetSetProvider";


export function getBankAccountPageParams(item: BankAccountGet): ItemPageParams {
    return {
        id: item.id,
        name: item.name,
    }
}

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
        itemId,
        BANK_ACCOUNT_PAGE_TITLE,
        BANK_ACCOUNT_PAGE_DESCRIPTION,
        BANK_ACCOUNT_BREADCRUMBS,
        getBankAccountPageParams,
        getItemRouteBankAccountsItemIdGet,
        putItemRouteBankAccountsItemIdPut,
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
            <GetSetProvider getField={getField} setField={setField}>
                <BankAccountPostForm startLoading={startLoading} stopLoading={stopLoading}/>
            </GetSetProvider>
        </ItemPageForm>
    </Page>
}
