import {createContext, type Dispatch, type PropsWithChildren, type SetStateAction, useContext, useState} from 'react'

export interface HeaderData {
    title: string,
    breadcrumbs: {
        title: string
        href: string
    }[]
}

const HeaderDataStateContext = createContext<[
        HeaderData | undefined,
    Dispatch<SetStateAction<HeaderData | undefined>>
] | undefined>(undefined);

export function HeaderDataProvider({children}: PropsWithChildren<{}>) {
    const headerDataState = useState<HeaderData>();
    return <HeaderDataStateContext.Provider value={headerDataState}>
        {children}
    </HeaderDataStateContext.Provider>
}

export function useHeaderData() {
    const headerDataState = useContext(HeaderDataStateContext)
    if (headerDataState === undefined) {
        throw new Error('Attempted to call useHeaderData() outside of <HeaderDataProvider>')
    }
    return headerDataState
}
