import {Select} from "@mantine/core";
import {useEffect, useState} from "react";
import {useGetSetWithType} from "~/components/providers/GetSetProvider";

interface ItemTextInputProps<Type extends {}, Key extends keyof Type> {
    field: Key
    label: string
    description: string
    placeholder: string
    data: { value: string, label: string }[]
    required?: boolean
}

export function ItemSelectInput<Type extends {}, Key extends keyof Type>({
                                                                             field,
                                                                             label,
                                                                             description,
                                                                             placeholder,
                                                                             data,
                                                                             required = false,
                                                                         }: ItemTextInputProps<Type, Key>) {
    const {getField, setField} = useGetSetWithType<Type, string>()
    const [value, setValue] = useState<string | null>(null)

    useEffect(() => {
        setValue(getField(field) || null)
    }, [getField]);

    useEffect(() => {
        setField(field, value === null ? undefined : value)
    }, [value]);

    return <Select
        label={label}
        description={description}
        placeholder={placeholder}
        value={value}
        onChange={setValue}
        data={data}
        required={required}
    />
}
