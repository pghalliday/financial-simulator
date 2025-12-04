import {useCallback} from "react";
import {useDeleteItem} from "~/hooks/useDeleteItem";
import type {DeleteItemApi, IdItem} from "~/lib/types";

export interface Props<Get extends IdItem> {
    items: Get[],
    onDelete: DeleteItemApi<Get>,
    onDeleteSuccess: (items: Get[]) => void,
    onBeginDelete?: () => void,
    onEndDelete?: () => void,
}

export function useListDelete<Get extends IdItem>(
    {
        items,
        onDelete,
        onDeleteSuccess,
        onBeginDelete,
        onEndDelete,
    }: Props<Get>
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