import type {FormEventHandler, PropsWithChildren} from "react";
import {Button, Group, Space} from "@mantine/core";

interface ItemPageFormProps {
    onSubmit: FormEventHandler<HTMLFormElement>
    onReset: FormEventHandler<HTMLFormElement>
}

export function ItemPageForm(
    {
        onSubmit,
        onReset,
        children,
    }: PropsWithChildren<ItemPageFormProps>
) {
    return <form onSubmit={onSubmit} onReset={onReset}>
        {children}
        <Space h={20}/>
        <Group justify="flex-end">
            <Button type="reset">Reset</Button>
            <Button type="submit">Save</Button>
        </Group>
    </form>
}
