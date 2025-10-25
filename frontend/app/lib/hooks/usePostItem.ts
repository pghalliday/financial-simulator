import type {PostItemApi} from "~/lib/types";
import {callApi} from "~/lib/callApi";
import {POST_ITEM_ERROR_TITLE} from "~/strings";
import {useCallback} from "react";

export function usePostItem<Post, Get>(
    items: Get[],
    setItems: (items: Get[]) => void,
    postItemApi: PostItemApi<Post, Get>,
    startPosting: () => void,
    stopPosting: () => void,
    onPostSuccess: () => void,
): (post: Post) => void {
    return useCallback((post: Post) => {
        callApi({
            api: () => postItemApi({
                body: post
            }),
            errorTitle: POST_ITEM_ERROR_TITLE,
            onSuccess: (item) => {
                setItems(items.concat([item]))
                onPostSuccess()
            },
            begin: startPosting,
            end: stopPosting,
        });
    }, [items])
}