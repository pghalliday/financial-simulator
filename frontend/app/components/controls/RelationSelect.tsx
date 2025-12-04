import {Select} from "@mantine/core";
import {type FocusEventHandler, useCallback} from "react";
import type {NamedItem} from "~/lib/types";

export interface Props {
    data: NamedItem[]
    label?: string
    description?: string
    placeholder?: string
    required?: boolean
    value?: string | null
    defaultValue?: string | null
    onChange?: (value: string | null) => void
    onFocus?: FocusEventHandler<HTMLDivElement>
    onBlur?: FocusEventHandler<HTMLDivElement>
    error?: any
}

function mapData(items: NamedItem[]): { value: string, label: string }[] {
    return items.map(item => ({value: item.id, label: item.name}))
}

export function RelationSelect(
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
    const onInternalChange = useCallback((value: string | null) => {
        onChange && onChange(value)
    }, [onChange])

    return <Select
        label={label}
        placeholder={placeholder}
        description={description}
        required={required}
        onFocus={onFocus}
        onBlur={onBlur}
        error={error}
        value={value}
        defaultValue={defaultValue}
        data={mapData(data)}
        onChange={onInternalChange}
    />
}
