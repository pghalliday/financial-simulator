import {createContext, type Dispatch, type PropsWithChildren, type SetStateAction, useContext, useState} from 'react'
import {APP_NAME} from "~/page_params/PageParams";
import type {Breadcrumb} from "~/lib/types";

export interface HeaderData {
    title: string,
    breadcrumbs: Breadcrumb[]
}

const HeaderDataStateContext = createContext<[
    HeaderData,
    Dispatch<SetStateAction<HeaderData>>
] | undefined>(undefined);

export function HeaderDataProvider({children}: PropsWithChildren<{}>) {
    const headerDataState = useState<HeaderData>({
        title: APP_NAME,
        breadcrumbs: [],
    });
    return <HeaderDataStateContext.Provider value={headerDataState}>
        {children}
    </HeaderDataStateContext.Provider>
}

export function useHeaderData(): {
    headerData: HeaderData,
    setHeaderData: (headerData: HeaderData) => void,
} {
    const headerDataState = useContext(HeaderDataStateContext)
    if (headerDataState === undefined) {
        throw new Error('Attempted to call useHeaderData() outside of <HeaderDataProvider>')
    }
    const [headerData, setHeaderData] = headerDataState
    return {headerData, setHeaderData}
}
