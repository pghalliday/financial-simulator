import {Select} from "@mantine/core";
import {type ConstrainedItemPostFieldGetter, type ConstrainedItemPostFieldSetter,} from "~/lib/hooks/useItemPost";
import {useEffect, useState} from "react";

interface ItemTextInputProps<Type extends {}, Key extends keyof Type> {
    field: Key
    getField: ConstrainedItemPostFieldGetter<Type, Key, string>
    setField: ConstrainedItemPostFieldSetter<Type, Key, string>
    label: string
    description: string
    placeholder: string
    data: { value: string, label: string }[]
    required?: boolean
}

export function ItemSelectInput<Type extends {}, Key extends keyof Type>({
                                                                             field,
                                                                             getField,
                                                                             setField,
                                                                             label,
                                                                             description,
                                                                             placeholder,
                                                                             data,
                                                                             required = false,
                                                                         }: ItemTextInputProps<Type, Key>) {
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
