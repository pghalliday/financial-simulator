import {callApi} from "~/lib/callApi";
import {useEffect, useState} from "react";
import {GET_ITEM_ERROR_TITLE} from "~/strings";
import type {GetItemApi} from "~/lib/types";

export function useGetItem<Get>(
    itemId: string,
    getItemApi: GetItemApi<Get>,
    startGetting: () => void,
    stopGetting: () => void,
    depth: number = 0,
    maxParents: number = 0,
): { item: Get | undefined, setItem: (item: Get | undefined) => void } {
    const [item, setItem] = useState<Get>()

    useEffect(() => {
        callApi({
            api: () => getItemApi({
                path: {
                    item_id: itemId,
                },
                query: {
                    depth: depth,
                    max_parents: maxParents,
                }
            }),
            errorTitle: GET_ITEM_ERROR_TITLE,
            onSuccess: setItem,
            begin: startGetting,
            end: stopGetting,
        });
    }, [itemId]);

    return {item, setItem}
}
