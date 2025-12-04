import type {PostItemApi} from "~/lib/types";
import {callApi} from "~/lib/callApi";
import {POST_ITEM_ERROR_TITLE} from "~/page_params/constants";
import {useCallback} from "react";

export interface Props<Post, Get> {
    onSuccess: (item: Get) => void,
    onPost: PostItemApi<Post, Get>,
    onBegin?: () => void,
    onEnd?: () => void,
}

export function usePostItem<Post, Get>(
    {
        onSuccess,
        onPost,
        onBegin,
        onEnd,
    }: Props<Post, Get>): (post: Post) => void {
    return useCallback((post: Post) => {
        callApi({
            api: () => onPost({
                body: post
            }),
            errorTitle: POST_ITEM_ERROR_TITLE,
            onSuccess,
            onBegin,
            onEnd,
        });
    }, [onSuccess, onPost, onBegin, onEnd])
}