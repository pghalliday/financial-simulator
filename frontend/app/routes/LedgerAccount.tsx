import type {Route} from "./+types/LedgerAccount";
import {LEDGER_ACCOUNT_BREADCRUMBS, LEDGER_ACCOUNT_PAGE_DESCRIPTION, LEDGER_ACCOUNT_PAGE_TITLE,} from "~/strings";
import {ItemPageForm} from "~/components/pages/ItemPageForm";
import {useState} from "react";
import {
    getItemRouteLedgerAccountsItemIdGet,
    type LedgerAccountGet,
    type LedgerAccountPost,
    putItemRouteLedgerAccountsItemIdPut
} from "~/client";
import {useDisclosure} from "@mantine/hooks";
import {useItemPage} from "~/lib/hooks/useItemPage";
import {Page} from "~/components/pages/Page";
import {validateLedgerAccountPost} from "~/lib/validators";
import {LedgerAccountPostForm} from "~/components/forms/LedgerAccountPostForm";
import {LedgerAccountList} from "~/components/lists/LedgerAccountList";
import {Space, Title} from "@mantine/core";
import type {ItemPageParams} from "~/lib/hooks/useItemPageParams";
import {GetSetProvider} from "~/components/providers/GetSetProvider";

export function getLedgerAccountPageParams(item: LedgerAccountGet): ItemPageParams {
    const itemPageParams: ItemPageParams = {
        id: item.id,
        name: item.account_name,
    }
    if (item.parent !== null) {
        itemPageParams.parent = getLedgerAccountPageParams(item.parent)
    }
    return itemPageParams
}

export default function LedgerAccount({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    const [revertDisabled, setRevertDisabled] = useState(true)
    const [saveDisabled, setSaveDisabled] = useState(true)

    const {
        item,
        getField,
        setField,
        revert,
        submit,
        pageTitle,
        pageDescription,
        pageBreadcrumbs,
    } = useItemPage<LedgerAccountPost, LedgerAccountGet>(
        itemId,
        LEDGER_ACCOUNT_PAGE_TITLE,
        LEDGER_ACCOUNT_PAGE_DESCRIPTION,
        LEDGER_ACCOUNT_BREADCRUMBS,
        getLedgerAccountPageParams,
        getItemRouteLedgerAccountsItemIdGet,
        putItemRouteLedgerAccountsItemIdPut,
        startLoading,
        stopLoading,
        setRevertDisabled,
        setSaveDisabled,
        validateLedgerAccountPost,
        1,
        -1,
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
                <LedgerAccountPostForm parent={undefined}/>
            </GetSetProvider>
        </ItemPageForm>
        <Space h={20}/>
        <Title order={4}>Sub Accounts</Title>
        <Space h={20}/>
        <LedgerAccountList parent={item} items={item?.sub_accounts || []}/>
    </Page>
}
