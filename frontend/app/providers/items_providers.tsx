import {createContext, type PropsWithChildren, type ReactElement, useContext} from "react";
import {useGetItems} from "~/lib/hooks/useGetItems";
import type {GetItemsApi} from "~/lib/types";
import {
    getItemsRouteBankAccountsGet,
    getItemsRouteEntitiesGet,
    getItemsRouteLedgerAccountsGet,
    getItemsRouteScenariosGet
} from "~/client";

interface ProviderProps {
    onBegin?: () => void
    onEnd?: () => void
    depth?: number
    maxParents?: number
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

    function ItemsProvider({onBegin, onEnd, depth, maxParents, children}: PropsWithChildren<ProviderProps>) {
        const {items, setItems} = useGetItems({
            getItemsApi,
            onBegin,
            onEnd,
            depth,
            maxParents,
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
