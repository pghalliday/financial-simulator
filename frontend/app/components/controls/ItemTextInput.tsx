import {TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {useGetSetWithType} from "~/components/providers/GetSetProvider";

interface ItemTextInputProps<Type extends {}, Key extends keyof Type> {
    field: Key
    label: string
    description: string
    placeholder: string
    required?: boolean
}

export function ItemTextInput<Type extends {}, Key extends keyof Type>({
                                                                           field,
                                                                           label,
                                                                           description,
                                                                           placeholder,
                                                                           required = false,
                                                                       }: ItemTextInputProps<Type, Key>) {
    const {getField, setField} = useGetSetWithType<Type, string>()
    const [value, setValue] = useState("")

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
