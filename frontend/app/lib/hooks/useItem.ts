import {callApi} from "~/lib/callApi";
import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import {GET_ITEM_ERROR_TITLE} from "~/strings";
import type {GetItemApi} from "~/lib/types";

export function useItem<Type>(
    getItemApi: GetItemApi<Type>,
    itemId: string,
    startLoading: () => void,
    stopLoading: () => void,
): [Type | undefined, Dispatch<SetStateAction<Type | undefined>>] {
    const [item, setItem] = useState<Type>()
    useEffect(() => {
        callApi({
            api: () => getItemApi({
                path: {
                    item_id: itemId,
                },
            }),
            errorTitle: GET_ITEM_ERROR_TITLE,
            onSuccess: setItem,
            startLoading,
            stopLoading,
        });
    }, []);
    return [item, setItem]
}