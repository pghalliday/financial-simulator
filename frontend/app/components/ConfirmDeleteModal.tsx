import {Button, Group, Modal, Space, Text} from "@mantine/core";

export function ConfirmDeleteModal(
    {
        opened,
        onConfirm,
        onCancel,
        label,
        name,
    }: {
        opened: boolean,
        onConfirm: () => void,
        onCancel: () => void,
        label: string,
        name: string,
    }
) {
    return <Modal
        opened={opened}
        onClose={onCancel}
        title={`Confirm delete ${label}`}
    >
        <Text>{`Are you sure you want to delete ${label}: "${name}"?`}</Text>
        <Space h={20}/>
        <Group justify="flex-end">
            <Button
                onClick={onConfirm}
            >Delete</Button>
            <Button
                color="red"
                variant="outline"
                onClick={onCancel}
            >Cancel</Button>
        </Group>
    </Modal>
}
