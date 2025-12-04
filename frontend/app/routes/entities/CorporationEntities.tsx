import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {BankAccountsProvider, CorporationEntitiesProvider, ScenariosProvider} from "~/providers/items_providers";
import {CorporationEntitiesPage} from "~/pages/entities/collections/CorporationEntitiesPage";

export default function CorporationEntities() {
    const [loadingEntities, {open: startLoadingEntities, close: stopLoadingEntities}] = useDisclosure()
    const [loadingScenarios, {open: startLoadingScenarios, close: stopLoadingScenarios}] = useDisclosure()
    const [loadingBankAccounts, {open: startLoadingBankAccounts, close: stopLoadingBankAccounts}] = useDisclosure()
    return <LoadingProvider loading={loadingEntities || loadingScenarios || loadingBankAccounts}>
        <CorporationEntitiesProvider
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
                    <CorporationEntitiesPage/>
                </BankAccountsProvider>
            </ScenariosProvider>
        </CorporationEntitiesProvider>
    </LoadingProvider>
}
