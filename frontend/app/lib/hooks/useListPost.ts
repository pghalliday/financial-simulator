import {useCallback} from "react";
import {usePostItem} from "~/lib/hooks/usePostItem";
import type {PostItemApi} from "~/lib/types";

export interface Props<Post extends {}, Get extends Post> {
    items: Get[],
    onPost: PostItemApi<Post, Get>,
    onPostSuccess: (items: Get[]) => void,
    onBeginPost?: () => void,
    onEndPost?: () => void,
}

export function useListPost<Post extends {}, Get extends Post>(
    {
        items,
        onPost,
        onPostSuccess,
        onBeginPost,
        onEndPost,
    }: Props<Post, Get>
): (post: Post) => void {
    const _onPostSuccess = useCallback((item: Get) => {
        onPostSuccess && onPostSuccess(items.concat([item]))
    }, [items])

    return usePostItem<Post, Get>({
        onSuccess: _onPostSuccess,
        onPost,
        onBegin: onBeginPost,
        onEnd: onEndPost,
    })
}