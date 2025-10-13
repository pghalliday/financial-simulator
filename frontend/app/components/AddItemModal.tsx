import {Button, Group, LoadingOverlay, Modal, Select, Space, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";

export interface ToAddData {
    name: string
    description: string
    type: string | null
}

export function AddItemModal(
    {
        opened,
        working,
        initialData,
        onSubmit,
        onCancel,
        collectionLabel,
        typeSelectData,
    }: {
        opened: boolean,
        working: boolean,
        initialData: ToAddData,
        onSubmit: (toAddData: ToAddData) => void,
        onCancel: () => void,
        collectionLabel: string,
        typeSelectData?: { value: string, label: string }[]
    }
) {
    const capitalizedLabel = collectionLabel.replace(/^./, collectionLabel[0].toUpperCase())
    const [typeValue, setTypeValue] = useState<string | null>(initialData.type)
    const [nameValue, setNameValue] = useState<string>(initialData.name)
    const [descriptionValue, setDescriptionValue] = useState<string>(initialData.description)

    useEffect(() => {
        if (!opened) {
            setNameValue(initialData.name)
            setTypeValue(initialData.type)
            setDescriptionValue(initialData.description)
        }
    }, [opened]);

    function TypeSelect() {
        if (typeSelectData === undefined) {
            return null;
        }
        return <Select
            label="Type"
            description={`Select the ${collectionLabel} type`}
            value={typeValue}
            onChange={setTypeValue}
            data={typeSelectData}
        />
    }

    return <Modal
        opened={opened}
        onClose={onCancel}
        title={`Add ${collectionLabel}`}
    >
        <LoadingOverlay
            visible={working}
            zIndex={1000}
            overlayProps={{blur: 2}}
        />
        <TextInput
            data-autofocus
            label="Name"
            placeholder={`${capitalizedLabel} name`}
            description={`Enter a name for the new ${collectionLabel}`}
            size="sm"
            required={true}
            value={nameValue}
            onChange={event => setNameValue(event.currentTarget.value)}
        />
        <TypeSelect/>
        <TextInput
            label="Description"
            placeholder={`${capitalizedLabel} description`}
            description={`Enter a description for the new ${collectionLabel}`}
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
