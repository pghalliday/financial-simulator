import {useDisclosure} from "@mantine/hooks";
import {
    BankAccountsProvider,
    DecimalProvidersProvider,
    RateProvidersProvider,
    SchedulesProvider
} from "~/providers/items_providers";
import BankAccountsPage from "~/pages/BankAccountsPage";
import {LedgerAccountTreeProvider} from "~/providers/tree_providers";
import {LoadingProvider} from "~/providers/LoadingProvider";

export default function BankAccounts() {
    const [loadingBankAccounts, {open: startLoadingBankAccounts, close: stopLoadingBankAccounts}] = useDisclosure()
    const [loadingLedgerAccounts, {
        open: startLoadingLedgerAccounts,
        close: stopLoadingLedgerAccounts
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
        loadingBankAccounts ||
        loadingLedgerAccounts ||
        loadingDecimalProviders ||
        loadingRateProviders ||
        loadingSchedules
    }>
        <BankAccountsProvider
            onBegin={startLoadingBankAccounts}
            onEnd={stopLoadingBankAccounts}
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
                            <BankAccountsPage/>
                        </SchedulesProvider>
                    </RateProvidersProvider>
                </DecimalProvidersProvider>
            </LedgerAccountTreeProvider>
        </BankAccountsProvider>
    </LoadingProvider>
}
