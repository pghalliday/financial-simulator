import type {Route} from "./+types/BankAccount";
import {BANK_ACCOUNT_BREADCRUMBS, BANK_ACCOUNT_PAGE_DESCRIPTION, BANK_ACCOUNT_PAGE_TITLE} from "~/strings";
import {type BankAccountGet} from "~/client";
import {useDisclosure} from "@mantine/hooks";
import type {ItemPageParams} from "~/lib/hooks/useItemPageParams";
import {BankAccountProvider} from "~/providers/item_providers";
import {LedgerAccountTreeProvider} from "~/providers/tree_providers";
import BankAccountPage from "~/pages/BankAccountPage/BankAccountPage";
import {LoadingProvider} from "~/providers/LoadingProvider";


export function getBankAccountPageParams(item: BankAccountGet): ItemPageParams {
    return {
        id: item.id,
        name: item.name,
    }
}

export default function BankAccount({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loadingBankAccount, {open: startLoadingBankAccount, close: stopLoadingBankAccount}] = useDisclosure()
    const [loadingLedgerAccounts, {
        open: startLoadingLedgerAccounts,
        close: stopLoadingLedgerAccounts
    }] = useDisclosure()

    return <LoadingProvider loading={loadingBankAccount || loadingLedgerAccounts}>
        <BankAccountProvider
            itemId={itemId}
            itemPageTitle={BANK_ACCOUNT_PAGE_TITLE}
            itemPageDescription={BANK_ACCOUNT_PAGE_DESCRIPTION}
            itemBreadcrumbs={BANK_ACCOUNT_BREADCRUMBS}
            getItemPageParams={getBankAccountPageParams}
            onBegin={startLoadingBankAccount}
            onEnd={stopLoadingBankAccount}
        >
            <LedgerAccountTreeProvider
                onBegin={startLoadingLedgerAccounts}
                onEnd={stopLoadingLedgerAccounts}
            >
                <BankAccountPage/>
            </LedgerAccountTreeProvider>
        </BankAccountProvider>
    </LoadingProvider>
}
