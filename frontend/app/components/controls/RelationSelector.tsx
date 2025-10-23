import {MultiSelect} from "@mantine/core";
import {useCallback, useEffect, useState} from "react";
import type {
    DeleteRelatedItemApi,
    GetItemsApi,
    GetRelatedItemsApi,
    IdItem,
    NamedItem,
    PostRelatedItemApi
} from "~/lib/types";
import {callApi} from "~/lib/callApi";
import {
    DELETE_RELATED_ITEM_ERROR_TITLE,
    GET_RELATED_ITEMS_ERROR_TITLE,
    GET_RELATED_OPTIONS_ERROR_TITLE,
    POST_RELATED_ITEM_ERROR_TITLE
} from "~/strings";

export interface RelationSelectorProps<Get extends NamedItem> {
    itemId: string
    label: string
    getRelatedOptions: GetItemsApi<Get>
    getRelatedItems: GetRelatedItemsApi<Get>
    postRelatedItem: PostRelatedItemApi<IdItem, Get>
    deleteRelatedItem: DeleteRelatedItemApi<Get>
    startLoading: () => void,
    stopLoading: () => void,
}

export function RelationSelector<Get extends NamedItem>({
                                                            itemId,
                                                            label,
                                                            getRelatedOptions,
                                                            getRelatedItems,
                                                            postRelatedItem,
                                                            deleteRelatedItem,
                                                            startLoading,
                                                            stopLoading,
                                                        }: RelationSelectorProps<Get>) {
    const capitalizedLabel = label.replace(/^./, label[0].toUpperCase())
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [selectItemsData, setSelectItemsData] = useState<{ value: string, label: string }[]>([])
    const placeholder = `Select ${label}`

    useEffect(() => {
        callApi({
            api: getRelatedOptions,
            errorTitle: GET_RELATED_OPTIONS_ERROR_TITLE,
            onSuccess: (items) => setSelectItemsData(items.map(item => ({
                value: item.id,
                label: item.name,
            }))),
            begin: startLoading,
            end: stopLoading,
        });
    }, []);

    useEffect(() => {
        callApi({
            api: () => getRelatedItems({
                path: {
                    item_id: itemId,
                },
            }),
            errorTitle: GET_RELATED_ITEMS_ERROR_TITLE,
            onSuccess: (items) => setSelectedItems(items.map(item => item.id)),
            begin: startLoading,
            end: stopLoading,
        });
    }, [itemId, selectItemsData]);

    const change = useCallback((values: string[]) => {
        for (const value of values) {
            if (!selectedItems.includes(value)) {
                callApi({
                    api: () => postRelatedItem({
                        path: {
                            item_id: itemId,
                        },
                        body: {
                            id: value,
                        },
                    }),
                    errorTitle: POST_RELATED_ITEM_ERROR_TITLE,
                    onSuccess: () => setSelectedItems(selectedItems.concat(value)),
                    begin: startLoading,
                    end: stopLoading,
                });
            }
        }
        for (const value of selectedItems) {
            if (!values.includes(value)) {
                callApi({
                    api: () => deleteRelatedItem({
                        path: {
                            item_id: itemId,
                            related_item_id: value,
                        },
                    }),
                    errorTitle: DELETE_RELATED_ITEM_ERROR_TITLE,
                    onSuccess: () => setSelectedItems(selectedItems.filter(item => item !== value)),
                    begin: startLoading,
                    end: stopLoading,
                });
            }
        }
    }, [itemId, selectedItems])

    return <MultiSelect
        label={capitalizedLabel}
        placeholder={placeholder}
        value={selectedItems}
        data={selectItemsData}
        onChange={change}
    />
}

