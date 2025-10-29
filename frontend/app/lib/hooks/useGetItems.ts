import type {GetItemsApi} from "~/lib/types";
import {useEffect, useState} from "react";
import {callApi} from "~/lib/callApi";
import {GET_ITEMS_ERROR_TITLE} from "~/strings";

export function useGetItems<Get>(
    getItemApi: GetItemsApi<Get>,
    startGetting: () => void,
    stopGetting: () => void,
    depth: number = 0,
    maxParents: number = 0,
): {
    items: Get[],
    setItems: (items: Get[]) => void,
} {
    const [items, setItems] = useState<Get[]>([])

    useEffect(() => {
        callApi({
            api: () => getItemApi({
                query: {
                    depth: depth,
                    max_parents: maxParents,
                }
            }),
            errorTitle: GET_ITEMS_ERROR_TITLE,
            onSuccess: setItems,
            begin: startGetting,
            end: stopGetting,
        })
    }, []);

    return {items, setItems}
}