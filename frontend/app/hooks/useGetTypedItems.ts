import type {GetTypedItemsApi} from "~/lib/types";
import {useEffect, useState} from "react";
import {callApi} from "~/lib/callApi";
import {GET_ITEMS_ERROR_TITLE} from "~/page_params/constants";

export interface Props<Get extends { type: any }, Type = Get["type"]> {
    getTypedItemsApi: GetTypedItemsApi<Get, Type>
    type: Type
    onBegin?: () => void
    onEnd?: () => void
}

export function useGetTypedItems<Get extends { type: any }, Type = Get["type"]>(
    {
        getTypedItemsApi,
        type,
        onBegin,
        onEnd,
    }: Props<Get, Type>
): {
    items: Get[],
    setItems: (items: Get[]) => void,
} {
    const [items, setItems] = useState<Get[]>([])

    useEffect(() => {
        callApi({
            api: () => getTypedItemsApi({
                query: {
                    type
                }
            }),
            errorTitle: GET_ITEMS_ERROR_TITLE,
            onSuccess: setItems,
            onBegin,
            onEnd,
        })
    }, []);

    return {items, setItems}
}