import {Button, Group, Modal, Select, Space, TextInput} from "@mantine/core";
import {useState} from "react";

export function AddItemModal(
    {
        opened,
        onSubmit,
        onCancel,
        label,
        types,
    }: {
        opened: boolean,
        onSubmit: () => void,
        onCancel: () => void,
        label: string,
        types?: Record<string, string>,
    }
) {
    const capitalizedLabel = label.replace(/^./, label[0].toUpperCase())

    function TypeSelect() {
        if (types === undefined) {
            return null;
        }
        const data = Object.entries(types).map(entry => ({
            value: entry[0],
            label: entry[1]
        }));
        const [value, setValue] = useState<string | null>(data[0].value)
        return <Select
            label="Type"
            description={`Select the ${label} type`}
            value={value}
            onChange={setValue}
            data={data}
        />
    }

    return <Modal
        opened={opened}
        onClose={onCancel}
        title={`Add ${label}`}
    >
        <TextInput
            label="Name"
            placeholder={`${capitalizedLabel} name`}
            description={`Enter a name for the new ${label}`}
            size="sm"
            required={true}
        />
        <TypeSelect/>
        <TextInput
            label="Description"
            placeholder={`${capitalizedLabel} description`}
            description={`Enter a description for the new ${label}`}
            size="sm"
        />
        <Space h={20}/>
        <Group justify="flex-end">
            <Button
                onClick={onSubmit}
            >Submit</Button>
            <Button
                color="red"
                variant="outline"
                onClick={onCancel}
            >Cancel</Button>
        </Group>
    </Modal>
}
