import type {DeleteItemApi, IdItem} from "~/lib/types";
import {callApi} from "~/lib/callApi";
import {DELETE_ITEM_ERROR_TITLE} from "~/strings";
import {useCallback, useState} from "react";

export function useDeleteItem<Get extends IdItem>(
    items: Get[],
    setItems: (items: Get[]) => void,
    deleteItemApi: DeleteItemApi<Get>,
    startDeleting: () => void,
    stopDeleting: () => void,
    onDeleteSuccess: () => void,
): {
    setToDelete: (toDelete: Get) => void,
    deleteItem: () => void
} {
    const [toDelete, setToDelete] = useState<Get>()

    const deleteItem = useCallback(() => {
        if (toDelete !== undefined) {
            callApi({
                api: () => deleteItemApi({
                    path: {
                        item_id: toDelete.id,
                    },
                }),
                errorTitle: DELETE_ITEM_ERROR_TITLE,
                onSuccess: (deleted) => {
                    setItems(items.filter(item => item.id !== deleted.id))
                    onDeleteSuccess()
                },
                begin: startDeleting,
                end: stopDeleting,
            });
        }
    }, [items, toDelete])

    return {setToDelete, deleteItem}
}