import {callApi} from "~/lib/callApi";
import {useEffect, useState} from "react";
import {GET_ITEM_ERROR_TITLE} from "~/strings";
import type {GetItemApi} from "~/lib/types";

export interface Props<Get> {
    itemId: string,
    getItemApi: GetItemApi<Get>,
    onBegin?: () => void,
    onEnd?: () => void,
}

export function useGetItem<Get>(
    {
        itemId,
        getItemApi,
        onBegin,
        onEnd,
    }: Props<Get>
): { item?: Get, setItem: (item?: Get) => void } {
    const [item, setItem] = useState<Get>()

    useEffect(() => {
        callApi({
            api: () => getItemApi({
                path: {
                    item_id: itemId,
                },
            }),
            errorTitle: GET_ITEM_ERROR_TITLE,
            onSuccess: setItem,
            onBegin,
            onEnd,
        });
    }, [itemId]);

    return {item, setItem}
}
