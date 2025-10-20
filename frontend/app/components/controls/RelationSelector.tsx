import type {APIResult} from "~/lib/api_wrapper";
import type {RowData} from "~/components/controls/item_list/ItemList";
import {MultiSelect} from "@mantine/core";
import {useCallback, useEffect, useState} from "react";

export interface RelationSelectorProps {
    itemId: string
    name: string
    label: string
    getOptions: () => Promise<APIResult<RowData[]>>
    getSelected: (itemId: string) => Promise<APIResult<RowData[]>>
    select: (itemId: string, relatedItemId: string) => Promise<APIResult<RowData>>
    deselect: (itemId: string, relatedItemId: string) => Promise<APIResult<RowData>>
}

export function RelationSelector({
                                     itemId,
                                     name,
                                     label,
                                     getOptions,
                                     getSelected,
                                     select,
                                     deselect
                                 }: RelationSelectorProps) {
    const capitalizedLabel = label.replace(/^./, label[0].toUpperCase())
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [selectItemsData, setSelectItemsData] = useState<{ value: string, label: string }[]>([])
    const placeholder = `Select ${label}`

    useEffect(() => {
        getOptions().then(({data, error, response}) => {
            if (data !== undefined) {
                setSelectItemsData(data.map(item => ({
                    value: item.id,
                    label: item.name,
                })))
            }
            // TODO: errors
        })
    }, []);

    useEffect(() => {
        getSelected(itemId).then(({data, error, response}) => {
            if (data !== undefined) {
                setSelectedItems(data.map(item => item.id))
            }
            // TODO: errors
        })
    }, [itemId, selectItemsData]);

    const change = useCallback((values: string[]) => {
        for (const value of values) {
            if (!selectedItems.includes(value)) {
                select(itemId, value).then(({data, error, response}) => {
                    if (data !== undefined) {
                        setSelectedItems(selectedItems.concat(value))
                    }
                    // TODO: errors
                })
            }
        }
        for (const value of selectedItems) {
            if (!values.includes(value)) {
                deselect(itemId, value).then(({data, error, response}) => {
                    if (data !== undefined) {
                        setSelectedItems(selectedItems.filter(item => item !== value))
                    }
                    // TODO: errors
                })
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

