import {createContext, type PropsWithChildren, useContext} from "react";

const Context = createContext<boolean | undefined>(undefined);

interface Props {
    loading: boolean
}

export function LoadingProvider({loading, children}: PropsWithChildren<Props>) {
    return <Context.Provider value={loading}>
        {children}
    </Context.Provider>
}

export function useLoading(): boolean {
    const loading = useContext(Context)
    if (loading === undefined) {
        throw new Error('Attempted to call useLoading() outside of <LoadingProvider>')
    }
    return loading
}
