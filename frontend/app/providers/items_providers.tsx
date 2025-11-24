import {createContext, type PropsWithChildren, type ReactElement, useContext} from "react";
import {useGetItems} from "~/lib/hooks/useGetItems";
import type {GetItemsApi} from "~/lib/types";
import {
    getItemsRouteBankAccountsGet,
    getItemsRouteDecimalProvidersGet,
    getItemsRouteEntitiesGet,
    getItemsRouteLedgerAccountsGet,
    getItemsRouteRateProvidersGet,
    getItemsRouteRatesGet,
    getItemsRouteScenariosGet,
    getItemsRouteSchedulesGet,
} from "../../client";

interface ProviderProps {
    onBegin?: () => void
    onEnd?: () => void
}

type ContextData<Get> = [Get[], (items: Get[]) => void]

interface Props<Get> {
    label: string
    getItemsApi: GetItemsApi<Get>
}

type ProviderType = (
    props: PropsWithChildren<ProviderProps>
) => ReactElement

function createItemsProvider<Get>(
    {
        label,
        getItemsApi,
    }: Props<Get>
): [ProviderType, () => ContextData<Get>] {
    const Context = createContext<ContextData<Get> | undefined>(undefined);

    function ItemsProvider({onBegin, onEnd, children}: PropsWithChildren<ProviderProps>) {
        const {items, setItems} = useGetItems({
            getItemsApi,
            onBegin,
            onEnd,
        })
        return <Context.Provider value={[items, setItems]}>
            {children}
        </Context.Provider>
    }

    function useItems(): ContextData<Get> {
        const contextData = useContext(Context)
        if (contextData === undefined) {
            throw new Error(`Attempted to call use${label}() outside of <${label}Provider>`)
        }
        return contextData
    }

    return [ItemsProvider, useItems]
}

export const [ScenariosProvider, useScenarios] = createItemsProvider({
    label: "Scenarios",
    getItemsApi: getItemsRouteScenariosGet,
})

export const [EntitiesProvider, useEntities] = createItemsProvider({
    label: "Entities",
    getItemsApi: getItemsRouteEntitiesGet,
})

export const [BankAccountsProvider, useBankAccounts] = createItemsProvider({
    label: "BankAccounts",
    getItemsApi: getItemsRouteBankAccountsGet,
})

export const [LedgerAccountsProvider, useLedgerAccounts] = createItemsProvider({
    label: "LedgerAccounts",
    getItemsApi: getItemsRouteLedgerAccountsGet,
})

export const [RatesProvider, useRates] = createItemsProvider({
    label: "Rates",
    getItemsApi: getItemsRouteRatesGet,
})

export const [SchedulesProvider, useSchedules] = createItemsProvider({
    label: "Schedules",
    getItemsApi: getItemsRouteSchedulesGet,
})

export const [DecimalProvidersProvider, useDecimalProviders] = createItemsProvider({
    label: "DecimalProviders",
    getItemsApi: getItemsRouteDecimalProvidersGet,
})

export const [RateProvidersProvider, useRateProviders] = createItemsProvider({
    label: "RateProviders",
    getItemsApi: getItemsRouteRateProvidersGet,
})
