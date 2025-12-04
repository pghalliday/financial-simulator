import {useDisclosure} from "@mantine/hooks";
import {LedgerAccountsProvider} from "~/providers/items_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {LedgerAccountsPage} from "~/pages/ledger_accounts/collections/LedgerAccountsPage";

export default function LedgerAccounts() {
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <LedgerAccountsProvider
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <LedgerAccountsPage/>
        </LedgerAccountsProvider>
    </LoadingProvider>
}
