import {useEffect, useState} from "react";
import type {ConstrainedItemPostFieldGetter} from "~/lib/hooks/useItemPost";
import type {TypedItem} from "~/lib/types";

export function useTypeIndicator<Type extends TypedItem>(types: Record<string, string>, getItemPostField: ConstrainedItemPostFieldGetter<Type, keyof Type, string>) {
    const [typeIndicator, setTypeIndicator] = useState("")

    useEffect(() => {
        const type = getItemPostField("type")
        if (type !== undefined) {
            setTypeIndicator(types[type])
        } else {
            setTypeIndicator("")
        }
    }, [getItemPostField]);

    return typeIndicator
}