import type {Route} from "./+types/Scenario";
import {useDisclosure} from "@mantine/hooks";
import {LedgerAccountProvider} from "~/providers/item_providers";
import type {LedgerAccountParentGet} from "../../client";
import type {ItemPageParams} from "~/lib/hooks/useItemPageParams";
import {LEDGER_ACCOUNT_BREADCRUMBS, LEDGER_ACCOUNT_PAGE_DESCRIPTION, LEDGER_ACCOUNT_PAGE_TITLE} from "~/strings";
import LedgerAccountPage from "~/pages/LedgerAccountPage/LedgerAccountPage";
import {LoadingProvider} from "~/providers/LoadingProvider";

export function getLedgerAccountPageParams(item: LedgerAccountParentGet): ItemPageParams {
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
    return <LoadingProvider loading={loading}>
        <LedgerAccountProvider
            itemId={itemId}
            itemPageTitle={LEDGER_ACCOUNT_PAGE_TITLE}
            itemPageDescription={LEDGER_ACCOUNT_PAGE_DESCRIPTION}
            itemBreadcrumbs={LEDGER_ACCOUNT_BREADCRUMBS}
            getItemPageParams={getLedgerAccountPageParams}
            onBegin={startLoading}
            onEnd={stopLoading}
        >
            <LedgerAccountPage/>
        </LedgerAccountProvider>
    </LoadingProvider>
}
