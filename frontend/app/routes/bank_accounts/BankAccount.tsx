import type {Route} from "./+types/BankAccount";
import {useDisclosure} from "@mantine/hooks";
import {BankAccountProvider} from "~/providers/item_providers";
import {LedgerAccountTreeProvider} from "~/providers/tree_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {DecimalProvidersProvider, RateProvidersProvider, SchedulesProvider} from "~/providers/items_providers";
import {BANK_ACCOUNT_PARAMS} from "~/page_params/bank_accounts";
import {BankAccountPage} from "~/pages/bank_accounts/items/BankAccountPage";


export default function BankAccount({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loadingBankAccount, {open: startLoadingBankAccount, close: stopLoadingBankAccount}] = useDisclosure()
    const [loadingLedgerAccounts, {
        open: startLoadingLedgerAccounts,
        close: stopLoadingLedgerAccounts,
    }] = useDisclosure()
    const [loadingDecimalProviders, {
        open: startLoadingDecimalProviders,
        close: stopLoadingDecimalProviders,
    }] = useDisclosure()
    const [loadingRateProviders, {
        open: startLoadingRateProviders,
        close: stopLoadingRateProviders,
    }] = useDisclosure()
    const [loadingSchedules, {
        open: startLoadingSchedules,
        close: stopLoadingSchedules,
    }] = useDisclosure()

    return <LoadingProvider loading={
        loadingBankAccount ||
        loadingLedgerAccounts ||
        loadingDecimalProviders ||
        loadingRateProviders ||
        loadingSchedules
    }>
        <BankAccountProvider
            itemId={itemId}
            itemParams={BANK_ACCOUNT_PARAMS}
            onBegin={startLoadingBankAccount}
            onEnd={stopLoadingBankAccount}
        >
            <LedgerAccountTreeProvider
                onBegin={startLoadingLedgerAccounts}
                onEnd={stopLoadingLedgerAccounts}
            >
                <DecimalProvidersProvider
                    onBegin={startLoadingDecimalProviders}
                    onEnd={stopLoadingDecimalProviders}
                >
                    <RateProvidersProvider
                        onBegin={startLoadingRateProviders}
                        onEnd={stopLoadingRateProviders}
                    >
                        <SchedulesProvider
                            onBegin={startLoadingSchedules}
                            onEnd={stopLoadingSchedules}
                        >
                            <BankAccountPage/>
                        </SchedulesProvider>
                    </RateProvidersProvider>
                </DecimalProvidersProvider>
            </LedgerAccountTreeProvider>
        </BankAccountProvider>
    </LoadingProvider>
}
