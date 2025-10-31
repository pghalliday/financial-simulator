import {type FormKeys, type FormRegistry, useFormContext} from "~/lib/hooks/useFormContext";
import {TreeSelect} from "~/components/controls/unbound/TreeSelect/TreeSelect";
import type {TreeData} from "~/lib/TreeData";

interface Props<Node extends {}, Form extends keyof FormRegistry> {
    formName: Form
    fieldName: FormKeys<Form>
    data: TreeData<Node>
    onCreate?: (search: string, parent: Node[]) => void,
    createPrompt?: string,
    label?: string
    description?: string
    placeholder?: string
    required?: boolean
}

export function BoundTreeSelect<Node extends {}, Form extends keyof FormRegistry>(
    {
        formName,
        fieldName,
        data,
        onCreate,
        createPrompt,
        label,
        description,
        placeholder,
        required = false,
    }: Props<Node, Form>
) {
    const form = useFormContext(formName)
    return <TreeSelect
        data={data}
        onCreate={onCreate}
        createPrompt={createPrompt}
        label={label}
        description={description}
        placeholder={placeholder}
        required={required}
        key={form.key(fieldName)}
        {...form.getInputProps(fieldName)}
    />
}
