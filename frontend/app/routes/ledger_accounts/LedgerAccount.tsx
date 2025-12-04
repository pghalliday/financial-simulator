import type {Route} from "./+types/LedgerAccount";
import {useDisclosure} from "@mantine/hooks";
import {LedgerAccountProvider} from "~/providers/item_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {LEDGER_ACCOUNT_PARAMS} from "~/page_params/ledger_accounts";
import {LedgerAccountPage} from "~/pages/ledger_accounts/items/LedgerAccountPage";

export default function LedgerAccount({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loading, {open: startLoading, close: stopLoading}] = useDisclosure()
    return <LoadingProvider loading={loading}>
        <LedgerAccountProvider
            itemId={itemId}
            itemParams={LEDGER_ACCOUNT_PARAMS}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <LedgerAccountPage/>
        </LedgerAccountProvider>
    </LoadingProvider>
}
