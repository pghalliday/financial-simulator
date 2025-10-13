import {Button, Group, Modal, Space, Text} from "@mantine/core";

export function ConfirmDeleteModal(
    {
        opened,
        onConfirm,
        onCancel,
        collectionLabel,
        itemName,
    }: {
        opened: boolean,
        onConfirm: () => void,
        onCancel: () => void,
        collectionLabel: string,
        itemName: string,
    }
) {
    return <Modal
        opened={opened}
        onClose={onCancel}
        title={`Confirm delete ${collectionLabel}`}
    >
        <Text>{`Are you sure you want to delete ${collectionLabel}: "${itemName}"?`}</Text>
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
