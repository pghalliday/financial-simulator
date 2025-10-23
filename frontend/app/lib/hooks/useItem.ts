import {callApi} from "~/lib/callApi";
import {useEffect, useState} from "react";
import {GET_ITEM_ERROR_TITLE, PUT_ITEM_ERROR_TITLE} from "~/strings";
import type {GetItemApi, PutItemApi} from "~/lib/types";

export function useItem<Post, Get>(
    getItemApi: GetItemApi<Get>,
    putItemApi: PutItemApi<Post, Get>,
    itemId: string,
    startLoading: () => void,
    stopLoading: () => void,
): { item: Get | undefined, putItem: (postItem: Post) => void } {
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
            begin: startLoading,
            end: stopLoading,
        });
    }, []);

    function putItem(post: Post) {
        callApi({
            api: () => putItemApi({
                path: {
                    item_id: itemId,
                },
                body: post,
            }),
            errorTitle: PUT_ITEM_ERROR_TITLE,
            onSuccess: setItem,
            begin: startLoading,
            end: stopLoading,
        });
    }

    return {item, putItem}
}