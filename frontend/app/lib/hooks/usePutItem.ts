import {callApi} from "~/lib/callApi";
import {useCallback} from "react";
import {PUT_ITEM_ERROR_TITLE} from "~/strings";
import type {IdItem, PutItemApi} from "~/lib/types";

export function usePutItem<Post, Get extends IdItem>(
    item: Get | undefined,
    setItem: (item: Get | undefined) => void,
    putItemApi: PutItemApi<Post, Get>,
    startPutting: () => void,
    stopPutting: () => void,
): (postItem: Post) => void {
    return useCallback((post: Post) => {
        if (item !== undefined) {
            callApi({
                api: () => putItemApi({
                    path: {
                        item_id: item.id,
                    },
                    body: post,
                }),
                errorTitle: PUT_ITEM_ERROR_TITLE,
                onSuccess: setItem,
                begin: startPutting,
                end: stopPutting,
            });
        }
    }, [item])
}