import assert from 'assert';
import {createContext, type Dispatch, type PropsWithChildren, type SetStateAction, useContext, useState} from 'react'

export interface HeaderData {
    title: string,
    breadcrumbs: {
        title: string
        href: string
    }[]
}

const DEFAULT_HEADER_DATA: HeaderData = {
    title: "Financial Simulator - Compare scenarios",
    breadcrumbs: [
        {
            title: "Compare scenarios",
            href: "/"
        },
    ],
};


const HeaderDataStateContext = createContext<[
    HeaderData,
    Dispatch<SetStateAction<HeaderData>>
] | undefined>(undefined);

export function HeaderDataProvider({children}: PropsWithChildren<{}>) {
    const headerDataState = useState<HeaderData>(DEFAULT_HEADER_DATA);
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
