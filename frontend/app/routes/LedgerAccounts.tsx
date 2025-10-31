import {useDisclosure} from "@mantine/hooks";
import {LedgerAccountsProvider} from "~/providers/items_providers";
import LedgerAccountsPage from "~/pages/LedgerAccountsPage";
import {LoadingProvider} from "~/providers/LoadingProvider";

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
