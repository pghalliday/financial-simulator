import {Select} from "@mantine/core";
import {useEffect, useState} from "react";
import {useGetSet} from "~/components/providers/GetSetProvider";
import type {KeysOfType} from "~/lib/types";

interface ItemSelectInputProps<Type> {
    field: KeysOfType<Type, string>
    label: string
    description: string
    placeholder: string
    data: { value: string, label: string }[]
    required?: boolean
}

export function ItemSelectInput<Type>({
                                          field,
                                          label,
                                          description,
                                          placeholder,
                                          data,
                                          required = false,
                                      }: ItemSelectInputProps<Type>) {
    const {get, set} = useGetSet<Type, string>(field)
    const [value, setValue] = useState<string | null>()

    useEffect(() => {
        setValue(get() || null)
    }, [get]);

    useEffect(() => {
        if (value !== undefined) {
            set(value === null ? undefined : value)
        }
    }, [value]);

    return <Select
        label={label}
        description={description}
        placeholder={placeholder}
        value={value ?? null}
        onChange={setValue}
        data={data}
        required={required}
    />
}
