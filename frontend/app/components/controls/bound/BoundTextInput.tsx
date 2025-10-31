import {TextInput} from "@mantine/core";
import {type FormKeys, type FormRegistry, useFormContext} from "~/lib/hooks/useFormContext";

interface Props<Form extends keyof FormRegistry> {
    formName: Form
    fieldName: FormKeys<Form>
    label?: string
    description?: string
    placeholder?: string
    required?: boolean
}

export function BoundTextInput<Form extends keyof FormRegistry>(
    {
        formName,
        fieldName,
        label,
        description,
        placeholder,
        required = false,
    }: Props<Form>
) {
    const form = useFormContext(formName)
    return <TextInput
        label={label}
        description={description}
        placeholder={placeholder}
        required={required}
        size="sm"
        key={form.key(fieldName)}
        {...form.getInputProps(fieldName)}
    />
}
