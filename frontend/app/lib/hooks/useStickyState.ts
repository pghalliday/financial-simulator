import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import {notifyError} from "~/lib/errors";

export enum StickyStateType {
    LOCAL,
    SESSION,
}

export interface Props<Type> {
    defaultValue: Type
    key: string
    type?: StickyStateType
}


export function useStickyState<Type>(
    {
        defaultValue,
        key,
        type = StickyStateType.LOCAL,
    }: Props<Type>
): [Type, Dispatch<SetStateAction<Type>>] {
    const storage = type === StickyStateType.LOCAL ? window.localStorage : window.sessionStorage
    const [value, setValue] = useState<Type>(() => {
        const stickyValue = storage.getItem(key);

        return stickyValue !== null
            ? JSON.parse(stickyValue)
            : defaultValue;
    });

    useEffect(() => {
        try {
            storage.setItem(key, JSON.stringify(value));
        } catch (e) {
            notifyError("Storage Error", e)
        }
    }, [key, value]);

    return [value, setValue];
}