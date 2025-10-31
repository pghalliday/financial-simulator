import {useDisclosure} from "@mantine/hooks";
import {BankAccountsProvider} from "~/providers/items_providers";
import BankAccountsPage from "~/pages/BankAccountsPage";
import {LedgerAccountTreeProvider} from "~/providers/tree_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";

export default function BankAccounts() {
    const [loadingBankAccounts, {open: startLoadingBankAccounts, close: stopLoadingBankAccounts}] = useDisclosure()
    const [loadingLedgerAccounts, {
        open: startLoadingLedgerAccounts,
        close: stopLoadingLedgerAccounts
    }] = useDisclosure()
    return <LoadingProvider loading={loadingBankAccounts || loadingLedgerAccounts}>
        <BankAccountsProvider
            onBegin={startLoadingBankAccounts}
            onEnd={stopLoadingBankAccounts}
        >
            <LedgerAccountTreeProvider
                onBegin={startLoadingLedgerAccounts}
                onEnd={stopLoadingLedgerAccounts}
            >
                <BankAccountsPage/>
            </LedgerAccountTreeProvider>
        </BankAccountsProvider>
    </LoadingProvider>
}
