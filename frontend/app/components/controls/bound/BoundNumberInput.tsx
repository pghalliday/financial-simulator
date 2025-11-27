import {NumberInput} from "@mantine/core";
import {type FormKeys, type FormRegistry, useFormContext} from "~/lib/hooks/useFormContext";
import type {Ref} from "react";

interface Props<
    Form extends keyof FormRegistry,
> {
    ref?: Ref<HTMLInputElement>
    formName: Form
    fieldName: FormKeys<Form>
    label?: string
    description?: string
    placeholder?: string
    required?: boolean
    autoFocus?: boolean
}

export function BoundNumberInput<
    Form extends keyof FormRegistry,
>(
    {
        ref,
        formName,
        fieldName,
        label,
        description,
        placeholder,
        required = false,
        autoFocus,
    }: Props<Form>
) {
    const form = useFormContext(formName)
    return <NumberInput
        data-autofocus={autoFocus}
        ref={ref}
        label={label}
        description={description}
        placeholder={placeholder}
        required={required}
        size="sm"
        key={form.key(fieldName)}
        {...form.getInputProps(fieldName)}
    />
}
