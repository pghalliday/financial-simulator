import {ActionIcon, Group, Table, TextInput} from "@mantine/core";
import {RelationSelect} from "~/components/controls/RelationSelect";
import {IconTrash} from "@tabler/icons-react";
import type {NamedItem} from "~/lib/types";
import {useCallback, useState} from "react";

export interface NamedRelationRowValue {
    name: string
    relation: string | null
}

export interface Props {
    id: string
    value: NamedRelationRowValue
    data: NamedItem[]
    onChange: (relation: NamedRelationRowValue) => void
    onDelete: () => void
}

export function NamedRelationRow(
    {
        id,
        value,
        data,
        onChange,
        onDelete,
    }: Props
) {
    const [name, setName] = useState(value.name)
    const [relation, setRelation] = useState(value.relation)

    const onNameChange = useCallback((name: string) => {
        setName(name)
        onChange({
            name: name,
            relation: relation
        })
    }, [value])

    const onValueChange = useCallback((relation: string | null) => {
        setRelation(relation)
        onChange({
            name: name,
            relation: relation
        })
    }, [name])

    return <Table.Tr key={`${id}-row`}>
        <Table.Td key={`${id}-name-cell`}>
            <TextInput key={`${id}-name`} id={`${id}-name`} value={name}
                       onChange={event => onNameChange(event.currentTarget.value)}/>
        </Table.Td>
        <Table.Td key={`${id}-value-cell`}>
            <RelationSelect key={`${id}-value`} id={`${id}-value`} data={data} value={relation}
                            onChange={value => onValueChange(value)}/>
        </Table.Td>
        <Table.Td key={`${id}-delete-cell`}>
            <Group justify="center">
                <ActionIcon
                    variant="transparent"
                    size="sm"
                    onClick={onDelete}
                >
                    <IconTrash/>
                </ActionIcon>
            </Group>
        </Table.Td>
    </Table.Tr>
}