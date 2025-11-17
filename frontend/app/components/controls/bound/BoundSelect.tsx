import {Select} from "@mantine/core";
import {type FormKeys, type FormRegistry, useFormContext} from "~/lib/hooks/useFormContext";
import type {Ref} from "react";

interface Props<Form extends keyof FormRegistry> {
    ref?: Ref<HTMLInputElement>
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
        ref,
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
        ref={ref}
        label={label}
        description={description}
        placeholder={placeholder}
        data={data}
        required={required}
        key={form.key(fieldName)}
        {...form.getInputProps(fieldName)}
    />
}
