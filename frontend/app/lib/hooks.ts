import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import {notifyError} from "~/lib/errors";

export enum StickyStateType {
    LOCAL,
    SESSION,
}

export function useStickyState<T>(defaultValue: T, key: string, type: StickyStateType = StickyStateType.LOCAL): [T, Dispatch<SetStateAction<T>>] {
    const storage = type === StickyStateType.LOCAL ? window.localStorage : window.sessionStorage
    const [value, setValue] = useState<T>(() => {
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
