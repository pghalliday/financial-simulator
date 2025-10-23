import {TextInput} from "@mantine/core";
import {type ConstrainedItemPostFieldGetter, type ConstrainedItemPostFieldSetter,} from "~/lib/hooks/useItemPost";
import {useEffect, useState} from "react";

interface ItemTextInputProps<Type extends {}, Key extends keyof Type> {
    field: Key
    getField: ConstrainedItemPostFieldGetter<Type, Key, string>
    setField: ConstrainedItemPostFieldSetter<Type, Key, string>
    label: string
    description: string
    placeholder: string
    required?: boolean
}

export function ItemTextInput<Type extends {}, Key extends keyof Type>({
                                                                           field,
                                                                           getField,
                                                                           setField,
                                                                           label,
                                                                           description,
                                                                           placeholder,
                                                                           required = false,
                                                                       }: ItemTextInputProps<Type, Key>) {
    const [value, setValue] = useState<string>("")

    useEffect(() => {
        setValue(getField(field) || "")
    }, [getField]);

    useEffect(() => {
        setField(field, value)
    }, [value]);

    return <TextInput
        label={label}
        description={description}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={event => setValue(event.currentTarget.value)}
        size="sm"
    />
}
