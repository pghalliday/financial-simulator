import type {DeleteItemApi, IdItem} from "~/lib/types";
import {callApi} from "~/lib/callApi";
import {DELETE_ITEM_ERROR_TITLE} from "~/strings";
import {useCallback, useState} from "react";

export interface Props<Get> {
    onSuccess: (deleted: Get) => void,
    onDelete: DeleteItemApi<Get>,
    onBegin?: () => void,
    onEnd?: () => void,
}

export function useDeleteItem<Get extends IdItem>(
    {
        onSuccess,
        onDelete,
        onBegin,
        onEnd,
    }: Props<Get>
): {
    setToDelete: (toDelete: Get) => void,
    deleteItem: () => void
} {
    const [toDelete, setToDelete] = useState<Get>()

    const deleteItem = useCallback(() => {
        if (toDelete !== undefined) {
            callApi({
                api: () => onDelete({
                    path: {
                        item_id: toDelete.id,
                    },
                }),
                errorTitle: DELETE_ITEM_ERROR_TITLE,
                onSuccess,
                onBegin,
                onEnd,
            });
        }
    }, [toDelete, onSuccess, onDelete, onBegin, onEnd])

    return {setToDelete, deleteItem}
}