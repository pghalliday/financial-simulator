import {useEffect, useState} from "react";
import type {KeysOfType, TypedItem} from "~/lib/types";
import {useGetSet} from "~/components/providers/GetSetProvider";

export function useTypeIndicator<
    Type extends TypedItem,
>(field: KeysOfType<Type, string>, types: Record<string, string>) {
    const {get} = useGetSet<Type, string>(field)
    const [typeIndicator, setTypeIndicator] = useState("")

    useEffect(() => {
        const type = get()
        if (type !== undefined) {
            setTypeIndicator(types[type])
        } else {
            setTypeIndicator("")
        }
    }, [get]);

    return typeIndicator
}