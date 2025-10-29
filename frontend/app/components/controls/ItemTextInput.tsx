import {TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {useGetSet} from "~/components/providers/GetSetProvider";
import type {KeysOfType} from "~/lib/types";

interface ItemTextInputProps<Type> {
    field: KeysOfType<Type, string>
    label: string
    description: string
    placeholder: string
    required?: boolean
}

export function ItemTextInput<Type>({
                                        field,
                                        label,
                                        description,
                                        placeholder,
                                        required = false,
                                    }: ItemTextInputProps<Type>) {
    const {get, set} = useGetSet<Type, string>(field)
    const [value, setValue] = useState<string>()

    useEffect(() => {
        setValue(get())
    }, [get]);

    useEffect(() => {
        if (value !== undefined) {
            set(value)
        }
    }, [value]);

    return <TextInput
        label={label}
        description={description}
        placeholder={placeholder}
        required={required}
        value={value ?? ""}
        onChange={event => setValue(event.currentTarget.value)}
        size="sm"
    />
}
