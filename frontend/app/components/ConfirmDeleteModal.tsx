import {Button, Group, LoadingOverlay, Modal, Space, Text} from "@mantine/core";

export function ConfirmDeleteModal(
    {
        opened,
        working,
        onConfirm,
        onCancel,
        collectionLabel,
        itemName,
    }: {
        opened: boolean,
        working: boolean,
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
        <LoadingOverlay
            visible={working}
            zIndex={1000}
            overlayProps={{blur: 2}}
        />
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
