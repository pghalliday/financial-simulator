import {Button, Group, LoadingOverlay, Modal, Space, Text, Title} from "@mantine/core";

export function ConfirmDeleteModal(
    {
        opened,
        working,
        onConfirm,
        onCancel,
        title,
        prompt,
    }: {
        opened: boolean,
        working: boolean,
        onConfirm: () => void,
        onCancel: () => void,
        title: string,
        prompt: string,
    }
) {
    return <Modal
        opened={opened}
        onClose={onCancel}
        title={<Title order={4}>{title}</Title>}
    >
        <LoadingOverlay
            visible={working}
            zIndex={1000}
            overlayProps={{blur: 2}}
        />
        <Text>{prompt}</Text>
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
