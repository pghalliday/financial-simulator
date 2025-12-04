import type {Route} from "./+types/IndividualEntity";
import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {BankAccountsProvider, ScenariosProvider} from "~/providers/items_providers";
import {IndividualEntityProvider} from "~/providers/item_providers";
import {INDIVIDUAL_ENTITY_PARAMS} from "~/page_params/entities";
import {IndividualEntityPage} from "~/pages/entities/items/IndividualEntityPage";

export default function IndividualEntity({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loadingEntity, {open: startLoadingEntity, close: stopLoadingEntity}] = useDisclosure()
    const [loadingScenarios, {open: startLoadingScenarios, close: stopLoadingScenarios}] = useDisclosure()
    const [loadingBankAccounts, {open: startLoadingBankAccounts, close: stopLoadingBankAccounts}] = useDisclosure()
    return <LoadingProvider loading={loadingEntity || loadingScenarios || loadingBankAccounts}>
        <IndividualEntityProvider
            itemId={itemId}
            itemParams={INDIVIDUAL_ENTITY_PARAMS}
            onBegin={startLoadingEntity}
            onEnd={stopLoadingEntity}
        >
            <ScenariosProvider
                onBegin={startLoadingScenarios}
                onEnd={stopLoadingScenarios}
            >
                <BankAccountsProvider
                    onBegin={startLoadingBankAccounts}
                    onEnd={stopLoadingBankAccounts}
                >
                    <IndividualEntityPage/>
                </BankAccountsProvider>
            </ScenariosProvider>
        </IndividualEntityProvider>
    </LoadingProvider>
}
