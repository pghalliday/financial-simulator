import {type FormKeys, type FormRegistry, useFormContext} from "~/lib/hooks/useFormContext";
import type {NamedItem} from "~/lib/types";
import {RelationSelect} from "~/components/controls/unbound/RelationSelect";

interface Props<Form extends keyof FormRegistry> {
    formName: Form
    fieldName: FormKeys<Form>
    data: NamedItem[]
    label?: string
    description?: string
    placeholder?: string
    required?: boolean
}

export function BoundRelationSelect<Form extends keyof FormRegistry>(
    {
        formName,
        fieldName,
        data,
        label,
        description,
        placeholder,
        required = false,
    }: Props<Form>
) {
    const form = useFormContext(formName)
    return <RelationSelect
        data={data}
        label={label}
        description={description}
        placeholder={placeholder}
        required={required}
        key={form.key(fieldName)}
        {...form.getInputProps(fieldName)}
    />
}
