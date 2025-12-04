import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {BankAccountsProvider, IndividualEntitiesProvider, ScenariosProvider} from "~/providers/items_providers";
import {IndividualEntitiesPage} from "~/pages/entities/collections/IndividualEntitiesPage";

export default function IndividualEntities() {
    const [loadingEntities, {open: startLoadingEntities, close: stopLoadingEntities}] = useDisclosure()
    const [loadingScenarios, {open: startLoadingScenarios, close: stopLoadingScenarios}] = useDisclosure()
    const [loadingBankAccounts, {open: startLoadingBankAccounts, close: stopLoadingBankAccounts}] = useDisclosure()
    return <LoadingProvider loading={loadingEntities || loadingScenarios || loadingBankAccounts}>
        <IndividualEntitiesProvider
            onBegin={startLoadingEntities}
            onEnd={stopLoadingEntities}
        >
            <ScenariosProvider
                onBegin={startLoadingScenarios}
                onEnd={stopLoadingScenarios}
            >
                <BankAccountsProvider
                    onBegin={startLoadingBankAccounts}
                    onEnd={stopLoadingBankAccounts}
                >
                    <IndividualEntitiesPage/>
                </BankAccountsProvider>
            </ScenariosProvider>
        </IndividualEntitiesProvider>
    </LoadingProvider>
}
