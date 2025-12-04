import {useCallback} from "react";
import {usePostItem} from "~/hooks/usePostItem";
import type {PostItemApi} from "~/lib/types";
import type {TreeData} from "~/lib/TreeData";

export interface Props<Post extends {}, Get extends Post> {
    treeData: TreeData<Get>
    onPost: PostItemApi<Post, Get>
    onPostSuccess: (treeData: TreeData<Get>) => void
    onBeginPost?: () => void
    onEndPost?: () => void
}

export function useTreePost<Post extends {}, Get extends Post>(
    {
        treeData,
        onPost,
        onPostSuccess,
        onBeginPost,
        onEndPost,
    }: Props<Post, Get>
): (post: Post) => void {
    const _onPostSuccess = useCallback((item: Get) => {
        onPostSuccess && onPostSuccess(treeData.newTreeDataWith(item))
    }, [treeData])

    return usePostItem<Post, Get>({
        onSuccess: _onPostSuccess,
        onPost,
        onBegin: onBeginPost,
        onEnd: onEndPost,
    })
}