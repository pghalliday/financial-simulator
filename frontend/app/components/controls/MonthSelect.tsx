import {Select} from "@mantine/core";
import {type FocusEventHandler, useCallback} from "react";

const MONTHS: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

function mapInternal(value: string | null): number | null {
    return value === null ? null : MONTHS.indexOf(value)
}

function mapExternal(value: number | null | undefined): string | null {
    return value === null || value === undefined ? null : MONTHS[value]
}

export interface Props {
    label?: string
    description?: string
    placeholder?: string
    required?: boolean
    value?: number | null
    defaultValue?: number | null
    onChange?: (value: number | null) => void
    onFocus?: FocusEventHandler<HTMLDivElement>
    onBlur?: FocusEventHandler<HTMLDivElement>
    error?: any
}

export function MonthSelect(
    {
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
        onChange && onChange(mapInternal(value))
    }, [onChange])

    return <Select
        label={label}
        placeholder={placeholder}
        description={description}
        required={required}
        onFocus={onFocus}
        onBlur={onBlur}
        error={error}
        value={mapExternal(value)}
        defaultValue={mapExternal(defaultValue)}
        data={MONTHS}
        onChange={onInternalChange}
    />
}
