import {Button, Group, LoadingOverlay, Modal, Space, Title} from "@mantine/core";
import {type PropsWithChildren} from "react";

interface AddItemModalProps {
    opened: boolean,
    working: boolean,
    title: string,
    onSubmit: () => void,
    submitDisabled: boolean,
    onCancel: () => void,
}

export function AddItemModal(
    {
        opened,
        working,
        title,
        onSubmit,
        submitDisabled,
        onCancel,
        children,
    }: PropsWithChildren<AddItemModalProps>
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
        {children}
        <Space h={20}/>
        <Group justify="flex-end">
            <Button
                onClick={onSubmit}
                disabled={submitDisabled}
            >Submit</Button>
            <Button
                color="red"
                variant="outline"
                onClick={onCancel}
            >Cancel</Button>
        </Group>
    </Modal>
}
