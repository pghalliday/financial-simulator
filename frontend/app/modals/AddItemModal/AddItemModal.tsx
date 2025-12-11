import {Button, Group, LoadingOverlay, Modal, Space} from "@mantine/core";
import {type FormEventHandler, type PropsWithChildren} from "react";

interface AddItemModalProps {
    opened: boolean
    onClose: () => void
    stackId: string
    working: boolean
    title: string
    onSubmit: FormEventHandler<HTMLFormElement>
    onCancel: () => void
}

export function AddItemModal(
    {
        opened,
        onClose,
        stackId,
        working,
        title,
        onSubmit,
        onCancel,
        children,
    }: PropsWithChildren<AddItemModalProps>
) {
    // const form = useFormContext(formName)

    return <Modal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        title={title}
        size="auto"
    >
        <LoadingOverlay
            visible={working}
            zIndex={1000}
            overlayProps={{blur: 2}}
        />
        <form onSubmit={onSubmit}>
            {children}
            <Space h={20}/>
            <Group justify="flex-end">
                <Button
                    type="submit"
                >Submit</Button>
                <Button
                    color="red"
                    variant="outline"
                    onClick={onCancel}
                >Cancel</Button>
            </Group>
        </form>
    </Modal>
}
