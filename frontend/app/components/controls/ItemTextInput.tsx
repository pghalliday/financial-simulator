import {Skeleton, TextInput} from "@mantine/core";
import {type ConstrainedItemPostFieldGetter, type ConstrainedItemPostFieldSetter,} from "~/lib/hooks/useItemPost";

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
    const value = getField(field)
    return value !== undefined ? <TextInput
        label={label}
        description={description}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(event) => setField(field, event.currentTarget.value)}
        size="sm"
    /> : <Skeleton/>
}
