import {useEffect, useState} from "react";

export function useTypeIndicator(types: Record<string, string>, getItemPostField: (field: "type") => string | undefined) {
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