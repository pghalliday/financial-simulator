import {MultiSelect} from "@mantine/core";
import {useCallback, useEffect, useState} from "react";
import {useStickyState} from "~/lib/hooks";

export interface StickyMultiSelectProps {
    localStorageKey: string
    label: string
    placeholder: string
    onChange?: (itemIds: string[]) => void
    items?: { id: string, name: string }[]
}

export function StickyItemMultiSelect({
                                          localStorageKey,
                                          label,
                                          placeholder,
                                          onChange,
                                          items,
                                      }: StickyMultiSelectProps) {
    const [selectedItems, setSelectedItems] = useStickyState<string[]>([], localStorageKey)
    const [selectItemsData, setSelectItemsData] = useState<{
        value: string,
        label: string,
    }[]>([])

    const change = useCallback((selected: string[]) => {
        setSelectedItems(selected)
        if (onChange) {
            onChange(selectedItems)
        }
    }, [onChange]);

    useEffect(() => {
        if (items) {
            const data = items.map(
                item => ({value: item.id, label: item.name})
            )
            const selected = selectedItems.filter(
                itemId => items.map(item => item.id).includes(itemId)
            )
            setSelectItemsData(data)
            change(selected)
        }
    }, [items]);

    return <MultiSelect
        label={label}
        placeholder={placeholder}
        value={selectedItems}
        data={selectItemsData}
        onChange={change}
    />
}