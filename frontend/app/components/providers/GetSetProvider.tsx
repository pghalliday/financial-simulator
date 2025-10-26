import {createContext, type PropsWithChildren, useContext} from 'react'
import type {
    ConstrainedItemPostFieldGetter,
    ConstrainedItemPostFieldSetter,
    ItemPostFieldGetter,
    ItemPostFieldSetter,
} from "~/lib/hooks/useItemPost";

export interface GetSet<Post> {
    getField: ItemPostFieldGetter<Post>,
    setField: ItemPostFieldSetter<Post>,
}

export interface GetSetWithType<Post, Value> {
    getField: ConstrainedItemPostFieldGetter<Post, keyof Post, Value>,
    setField: ConstrainedItemPostFieldSetter<Post, keyof Post, Value>,
}

const GetSetContext = createContext<any | undefined>(undefined);

export function GetSetProvider<Post>({
                                         getField,
                                         setField,
                                         children,
                                     }: PropsWithChildren<GetSet<Post>>) {
    return <GetSetContext.Provider value={{
        getField,
        setField,
    }}>
        {children}
    </GetSetContext.Provider>
}

export function useGetSet<Post>() {
    const getSetProps = useContext(GetSetContext)
    if (getSetProps === undefined) {
        throw new Error('Attempted to call useGetSet() outside of <GetSetProvider>')
    }
    return getSetProps as GetSet<Post>
}

export function useGetSetWithType<Post, Value>() {
    const getSetProps = useContext(GetSetContext)
    if (getSetProps === undefined) {
        throw new Error('Attempted to call useGetSet() outside of <GetSetProvider>')
    }
    return getSetProps as GetSetWithType<Post, Value>
}
