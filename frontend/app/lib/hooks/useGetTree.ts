import type {GetItemsApi} from "~/lib/types";
import {useEffect, useState} from "react";
import {callApi} from "~/lib/callApi";
import {GET_ITEMS_ERROR_TITLE} from "~/strings";
import {TreeData, type TreeNodeFields} from "~/lib/TreeData";

export interface Props<Get> {
    getItemsApi: GetItemsApi<Get>
    fields: TreeNodeFields<Get>,
    onBegin?: () => void
    onEnd?: () => void
}

export function useGetTree<Get extends {}>(
    {
        getItemsApi,
        fields,
        onBegin,
        onEnd,
    }: Props<Get>
): {
    tree: TreeData<Get>,
    setTree: (tree: TreeData<Get>) => void,
} {
    const [tree, setTree] = useState(new TreeData([], fields))

    useEffect(() => {
        callApi({
            api: () => getItemsApi({
                query: {
                    depth: -1,
                    max_parents: 0,
                }
            }),
            errorTitle: GET_ITEMS_ERROR_TITLE,
            onSuccess: (items) => setTree(new TreeData(items, fields)),
            onBegin,
            onEnd,
        })
    }, []);

    return {tree, setTree}
}