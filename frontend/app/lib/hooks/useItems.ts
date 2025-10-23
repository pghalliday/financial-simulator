import {callApi} from "~/lib/callApi";
import {useCallback, useEffect, useState} from "react";
import {DELETE_ITEM_ERROR_TITLE, GET_ITEMS_ERROR_TITLE, POST_ITEM_ERROR_TITLE} from "~/strings";
import type {DeleteItemApi, GetItemsApi, IdItem, PostItemApi} from "~/lib/types";

export function useItems<Post, Get extends IdItem>(
    getItemsApi: GetItemsApi<Get>,
    startLoading: () => void,
    stopLoading: () => void,
    postItemApi: PostItemApi<Post, Get>,
    startPosting: () => void,
    stopPosting: () => void,
    onPostSuccess: () => void,
    deleteItemApi: DeleteItemApi<Get>,
    startDeleting: () => void,
    stopDeleting: () => void,
    onDeleteSuccess: () => void,
): {
    items: Get[],
    postItem: (post: Post) => void,
    setToDelete: (toDelete: Get) => void,
    deleteItem: () => void
} {
    const [items, setItems] = useState<Get[]>([])
    const [toDelete, setToDelete] = useState<Get>()

    useEffect(() => {
        callApi({
            api: getItemsApi,
            errorTitle: GET_ITEMS_ERROR_TITLE,
            onSuccess: setItems,
            begin: startLoading,
            end: stopLoading,
        });
    }, []);

    function postItem(post: Post) {
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
    }

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
    }, [toDelete])

    return {items, postItem, setToDelete, deleteItem}
}