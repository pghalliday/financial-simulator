import {useCallback} from "react";
import {useDeleteItem} from "~/lib/hooks/useDeleteItem";
import type {DeleteItemApi, IdItem} from "~/lib/types";

export interface Props<Post extends {}, Get extends IdItem> {
    items: Get[],
    onDelete: DeleteItemApi<Get>,
    onDeleteSuccess: (items: Get[]) => void,
    onBeginDelete?: () => void,
    onEndDelete?: () => void,
}

export function useListDelete<Post extends {}, Get extends Post & IdItem>(
    {
        items,
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
        onDeleteSuccess && onDeleteSuccess(items.filter(item => item.id !== deleted.id))
    }, [items])

    return useDeleteItem({
        onSuccess: _onDeleteSuccess,
        onDelete,
        onBegin: onBeginDelete,
        onEnd: onEndDelete,
    })
}