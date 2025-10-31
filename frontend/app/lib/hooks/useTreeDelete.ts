import {useCallback} from "react";
import {useDeleteItem} from "~/lib/hooks/useDeleteItem";
import type {DeleteItemApi, IdItem} from "~/lib/types";
import type {TreeData} from "~/lib/TreeData";

export interface Props<Post extends {}, Get extends Post & IdItem> {
    treeData: TreeData<Get>
    onDelete: DeleteItemApi<Get>
    onDeleteSuccess: (treeData: TreeData<Get>) => void
    onBeginDelete?: () => void
    onEndDelete?: () => void
}

export function useTreeDelete<Post extends {}, Get extends Post & IdItem>(
    {
        treeData,
        onDelete,
        onDeleteSuccess,
        onBeginDelete,
        onEndDelete,
    }: Props<Post, Get>
): {
    setToDelete: (toDelete: Get) => void,
    deleteItem: () => void,
} {
    const _onDeleteSuccess = useCallback((deleted: Get) => {
        onDeleteSuccess(treeData.newTreeDataWithout(deleted))
    }, [treeData])

    return useDeleteItem({
        onSuccess: _onDeleteSuccess,
        onDelete,
        onBegin: onBeginDelete,
        onEnd: onEndDelete,
    })
}