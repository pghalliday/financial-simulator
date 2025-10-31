import {Button, Group, LoadingOverlay, Modal, Space, Title} from "@mantine/core";
import {type PropsWithChildren} from "react";
import {type FormRegistry, type FormValues, useFormContext} from "~/lib/hooks/useFormContext";

interface AddItemModalProps<Form extends keyof FormRegistry> {
    opened: boolean
    onClose: () => void,
    stackId: string,
    formName: Form,
    working: boolean,
    title: string,
    onSubmit: (post: FormValues<Form>) => void,
    onCancel: () => void,
}

export function AddItemModal<Form extends keyof FormRegistry>(
    {
        opened,
        onClose,
        stackId,
        formName,
        working,
        title,
        onSubmit,
        onCancel,
        children,
    }: PropsWithChildren<AddItemModalProps<Form>>
) {
    const form = useFormContext(formName)

    return <Modal
        opened={opened}
        onClose={onClose}
        stackId={stackId}
        title={<Title order={4}>{title}</Title>}
    >
        <LoadingOverlay
            visible={working}
            zIndex={1000}
            overlayProps={{blur: 2}}
        />
        <form onSubmit={form.onSubmit(onSubmit)}>
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
