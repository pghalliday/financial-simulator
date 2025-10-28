import {createContext, type PropsWithChildren, useCallback, useContext} from 'react'
import type {
    ConstrainedItemPostFieldGetter,
    ConstrainedItemPostFieldSetter,
    ItemPostFieldGetter,
    ItemPostFieldSetter,
} from "~/lib/hooks/useItemPost";
import type {KeysOfType} from "~/lib/types";

export interface GetSet<Post> {
    getField: ItemPostFieldGetter<Post>,
    setField: ItemPostFieldSetter<Post>,
}

export interface GetSetWithType<Post, Value> {
    getField: ConstrainedItemPostFieldGetter<Post, Value>,
    setField: ConstrainedItemPostFieldSetter<Post, Value>,
}

type Getter<Value> = () => Value | undefined
type Setter<Value> = (value: Value | undefined) => void

export interface GetSetWithField<Value> {
    get: Getter<Value>,
    set: Setter<Value>,
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

export function useGetSet<Post, Value>(field: KeysOfType<Post, Value>): GetSetWithField<Value> {
    const getSetProps = useContext(GetSetContext)
    if (getSetProps === undefined) {
        throw new Error('Attempted to call useGetSet() outside of <GetSetProvider>')
    }
    const {getField, setField} = getSetProps as GetSetWithType<Post, Value>
    return {
        get: useCallback(() => getField(field), [field, getField]),
        set: useCallback((value) => setField(field, value), [field, setField]),
    }
}
