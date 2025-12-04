import {MultiSelect} from "@mantine/core";
import {type FocusEventHandler, useCallback} from "react";
import type {IdItem, NamedItem} from "~/lib/types";

export interface Props {
    data: NamedItem[]
    label?: string
    description?: string
    placeholder?: string
    required?: boolean
    value?: IdItem[]
    defaultValue?: IdItem[]
    onChange?: (value: IdItem[]) => void
    onFocus?: FocusEventHandler<HTMLDivElement>
    onBlur?: FocusEventHandler<HTMLDivElement>
    error?: any
}

function mapExternalValues(items: IdItem[]): string[] {
    return items.map((item) => item.id)
}

function mapInternalValues(ids: string[]): IdItem[] {
    return ids.map((id) => ({id}))
}

function mapData(items: NamedItem[]): { value: string, label: string }[] {
    return items.map(item => ({value: item.id, label: item.name}))
}

export function RelationMultiSelect(
    {
        data,
        label,
        description,
        placeholder,
        required,
        value,
        defaultValue,
        onChange,
        onFocus,
        onBlur,
        error,
    }: Props
) {
    const onInternalChange = useCallback((values: string[]) => {
        onChange && onChange(mapInternalValues(values))
    }, [onChange])

    const internalValue = value && mapExternalValues(value)
    const internalDefaultValue = defaultValue && mapExternalValues(defaultValue)

    return <MultiSelect
        label={label}
        placeholder={placeholder}
        description={description}
        required={required}
        onFocus={onFocus}
        onBlur={onBlur}
        error={error}
        value={internalValue}
        defaultValue={internalDefaultValue}
        data={mapData(data)}
        onChange={onInternalChange}
    />
}
