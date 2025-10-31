import type {PropsWithChildren} from "react";
import {Button, Group, Space} from "@mantine/core";
import {type FormRegistry, type FormValues, useFormContext} from "~/lib/hooks/useFormContext";

interface ItemPageFormProps<Form extends keyof FormRegistry> {
    formName: Form
    onSubmit: (post: FormValues<Form>) => void
}

export function ItemPageForm<Form extends keyof FormRegistry>(
    {
        formName,
        onSubmit,
        children,
    }: PropsWithChildren<ItemPageFormProps<Form>>
) {
    const form = useFormContext(formName)
    return <form onSubmit={form.onSubmit(onSubmit)} onReset={form.onReset}>
        {children}
        <Space h={20}/>
        <Group justify="flex-end">
            <Button type="reset">Reset</Button>
            <Button type="submit">Save</Button>
        </Group>
    </form>
}
