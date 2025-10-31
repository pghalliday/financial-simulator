import {Select} from "@mantine/core";
import {type FormKeys, type FormRegistry, useFormContext} from "~/lib/hooks/useFormContext";

interface Props<Form extends keyof FormRegistry> {
    formName: Form
    fieldName: FormKeys<Form>
    data: { value: string, label: string }[]
    label?: string
    description?: string
    placeholder?: string
    required?: boolean
}

export function BoundSelect<Form extends keyof FormRegistry>(
    {
        formName,
        fieldName,
        label,
        description,
        placeholder,
        data,
        required = false,
    }: Props<Form>
) {
    const form = useFormContext(formName)
    return <Select
        label={label}
        description={description}
        placeholder={placeholder}
        data={data}
        required={required}
        key={form.key(fieldName)}
        {...form.getInputProps(fieldName)}
    />
}
