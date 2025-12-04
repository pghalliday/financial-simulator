import {callApi} from "~/lib/callApi";
import {useCallback} from "react";
import {PUT_ITEM_ERROR_TITLE} from "~/page_params/constants";
import type {IdItem, PutItemApi} from "~/lib/types";

export interface Props<Post, Get extends IdItem> {
    item: Get | undefined,
    onSuccess: (item: Get) => void,
    putItemApi: PutItemApi<Post, Get>,
    onBegin?: () => void,
    onEnd?: () => void,
}

export function usePutItem<Post, Get extends IdItem>(
    {
        item,
        onSuccess,
        putItemApi,
        onBegin,
        onEnd,
    }: Props<Post, Get>): (postItem: Post) => void {
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
                onSuccess,
                onBegin,
                onEnd,
            });
        }
    }, [item, onSuccess, putItemApi, onBegin, onEnd])
}