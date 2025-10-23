import type {PropsWithChildren} from "react";
import {Button, Group, Space, Stack} from "@mantine/core";

interface ItemPageFormProps {
    onRevert: () => void
    revertDisabled: boolean
    onSave: () => void
    saveDisabled: boolean
}

export function ItemPageForm({
                                 onRevert,
                                 revertDisabled,
                                 onSave,
                                 saveDisabled,
                                 children,
                             }: PropsWithChildren<ItemPageFormProps>) {
    return <Stack>
        {children}
        <Space h={20}/>
        <Group justify="flex-end">
            <Button onClick={onRevert} disabled={revertDisabled}>Revert</Button>
            <Button onClick={onSave} disabled={saveDisabled}>Save</Button>
        </Group>
    </Stack>
}
