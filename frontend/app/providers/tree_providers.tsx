import {createContext, type PropsWithChildren, type ReactElement, useContext} from "react";
import type {GetItemsApi} from "~/lib/types";
import {getItemsRouteLedgerAccountsGet, type LedgerAccountGet} from "../../client";
import type {TreeData, TreeNodeFields} from "~/lib/TreeData";
import {useGetTree} from "~/hooks/useGetTree";

interface ProviderProps {
    onBegin?: () => void
    onEnd?: () => void
}

type ContextData<Get extends {}> = [TreeData<Get>, (tree: TreeData<Get>) => void]

interface Props<Get> {
    label: string
    getItemsApi: GetItemsApi<Get>
    fields: TreeNodeFields<Get>
}

type ProviderType = (
    props: PropsWithChildren<ProviderProps>
) => ReactElement

function createTreeProvider<Get extends {}>(
    {
        label,
        getItemsApi,
        fields,
    }: Props<Get>
): [ProviderType, () => ContextData<Get>] {
    const Context = createContext<ContextData<Get> | undefined>(undefined);

    function TreeProvider({onBegin, onEnd, children}: PropsWithChildren<ProviderProps>) {
        const {tree, setTree} = useGetTree({
            getItemsApi,
            fields,
            onBegin,
            onEnd,
        })
        return <Context.Provider value={[tree, setTree]}>
            {children}
        </Context.Provider>
    }

    function useTree(): ContextData<Get> {
        const contextData = useContext(Context)
        if (contextData === undefined) {
            throw new Error(`Attempted to call use${label}() outside of <${label}Provider>`)
        }
        return contextData
    }

    return [TreeProvider, useTree]
}

export const [LedgerAccountTreeProvider, useLedgerAccountTree] = createTreeProvider<LedgerAccountGet>({
    label: "LedgerAccountTree",
    getItemsApi: getItemsRouteLedgerAccountsGet,
    fields: {
        id: "id",
        parentId: "parent_id",
        children: "sub_accounts",
        label: "account_name",
    },
})
