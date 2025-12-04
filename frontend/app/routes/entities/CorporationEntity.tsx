import type {Route} from "./+types/CorporationEntity";
import {useDisclosure} from "@mantine/hooks";
import {LoadingProvider} from "~/providers/LoadingProvider";
import {BankAccountsProvider, ScenariosProvider} from "~/providers/items_providers";
import {CorporationEntityProvider} from "~/providers/item_providers";
import {CORPORATION_ENTITY_PARAMS} from "~/page_params/entities";
import {CorporationEntityPage} from "~/pages/entities/items/CorporationEntityPage";

export default function CorporationEntity({params}: Route.ComponentProps) {
    const {itemId} = params
    const [loadingEntity, {open: startLoadingEntity, close: stopLoadingEntity}] = useDisclosure()
    const [loadingScenarios, {open: startLoadingScenarios, close: stopLoadingScenarios}] = useDisclosure()
    const [loadingBankAccounts, {open: startLoadingBankAccounts, close: stopLoadingBankAccounts}] = useDisclosure()
    return <LoadingProvider loading={loadingEntity || loadingScenarios || loadingBankAccounts}>
        <CorporationEntityProvider
            itemId={itemId}
            itemParams={CORPORATION_ENTITY_PARAMS}
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
                    <CorporationEntityPage/>
                </BankAccountsProvider>
            </ScenariosProvider>
        </CorporationEntityProvider>
    </LoadingProvider>
}
