import {Button, Group, Modal, Select, Space, TextInput} from "@mantine/core";
import {useState} from "react";

export interface ToAddData {
    name: string
    description: string
    type: string | null
}

export function AddItemModal(
    {
        opened,
        onSubmit,
        onCancel,
        label,
        types,
    }: {
        opened: boolean,
        onSubmit: (toAddData: ToAddData) => void,
        onCancel: () => void,
        label: string,
        types?: Record<string, string>,
    }
) {
    const capitalizedLabel = label.replace(/^./, label[0].toUpperCase())
    const typeSelectData = types === undefined ? null : Object.entries(types)
        .map(entry => ({
            value: entry[0],
            label: entry[1]
        }));
    const typeInitialValue = typeSelectData === null ? null : typeSelectData[0].value
    const [typeValue, setTypeValue] = useState<string | null>(typeInitialValue)
    const [nameValue, setNameValue] = useState<string>("")
    const [descriptionValue, setDescriptionValue] = useState<string>("")

    function TypeSelect() {
        if (typeSelectData === null) {
            return null;
        }
        return <Select
            label="Type"
            description={`Select the ${label} type`}
            value={typeValue}
            onChange={setTypeValue}
            data={typeSelectData}
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
            value={nameValue}
            onChange={event => setNameValue(event.currentTarget.value)}
        />
        <TypeSelect/>
        <TextInput
            label="Description"
            placeholder={`${capitalizedLabel} description`}
            description={`Enter a description for the new ${label}`}
            size="sm"
            value={descriptionValue}
            onChange={event => setDescriptionValue(event.currentTarget.value)}
        />
        <Space h={20}/>
        <Group justify="flex-end">
            <Button
                onClick={() => onSubmit({
                    name: nameValue,
                    description: descriptionValue,
                    type: typeValue,
                })}
            >Submit</Button>
            <Button
                color="red"
                variant="outline"
                onClick={onCancel}
            >Cancel</Button>
        </Group>
    </Modal>
}
