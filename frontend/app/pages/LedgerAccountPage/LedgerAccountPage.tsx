import {Page} from "~/pages/common/Page";
import {LedgerAccountList} from "~/lists/LedgerAccountList";
import {Space, Title} from "@mantine/core";
import {LedgerAccountPostFormProvider} from "~/forms/ledger_account/LedgerAccountPostFormContext";
import {useState} from "react";
import {useLedgerAccount} from "~/providers/item_providers";
import LedgerAccountPageForms from "~/pages/LedgerAccountPage/LedgerAccountPageForms";

export default function LedgerAccountPage() {
    const [ledgerAccount, _putLedgerAccount, pageParams] = useLedgerAccount({})
    const [subAccounts, setSubAccounts] = useState(ledgerAccount?.sub_accounts)
    const [previousLedgerAccount, setPreviousLedgerAccount] = useState(ledgerAccount)
    if (previousLedgerAccount !== ledgerAccount) {
        setPreviousLedgerAccount(ledgerAccount)
        setSubAccounts(ledgerAccount?.sub_accounts)
    }

    return <Page
        pageParams={pageParams}
    >
        <LedgerAccountPostFormProvider
            key={ledgerAccount?.id}
            initialValues={ledgerAccount}
        >
            <LedgerAccountPageForms/>
        </LedgerAccountPostFormProvider>
        <Space h={20}/>
        <Title order={4}>Sub Accounts</Title>
        <Space h={20}/>
        <LedgerAccountPostFormProvider>
            <LedgerAccountList key={ledgerAccount?.id} parent={ledgerAccount} ledgerAccounts={subAccounts}
                               onChange={setSubAccounts}/>
        </LedgerAccountPostFormProvider>
    </Page>
}
