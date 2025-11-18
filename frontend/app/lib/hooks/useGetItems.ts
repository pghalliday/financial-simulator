import type {GetItemsApi} from "~/lib/types";
import {useEffect, useState} from "react";
import {callApi} from "~/lib/callApi";
import {GET_ITEMS_ERROR_TITLE} from "~/strings";

export interface Props<Get> {
    getItemsApi: GetItemsApi<Get>
    onBegin?: () => void
    onEnd?: () => void
}

export function useGetItems<Get>(
    {
        getItemsApi,
        onBegin,
        onEnd,
    }: Props<Get>
): {
    items: Get[],
    setItems: (items: Get[]) => void,
} {
    const [items, setItems] = useState<Get[]>([])

    useEffect(() => {
        callApi({
            api: () => getItemsApi(),
            errorTitle: GET_ITEMS_ERROR_TITLE,
            onSuccess: setItems,
            onBegin,
            onEnd,
        })
    }, []);

    return {items, setItems}
}