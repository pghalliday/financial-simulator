import {type FocusEventHandler, useCallback, useState} from "react";
import {ActionIcon, Group, InputWrapper, Paper, Space, Table} from "@mantine/core";
import {IconCirclePlus} from "@tabler/icons-react";
import type {NamedItem} from "~/lib/types";
import {
    NamedRelationRow,
    type NamedRelationRowValue
} from "~/components/controls/NamedRelationsSelect/NamedRelationRow";
import type {NamedDependentPost} from "../../../../client";

export interface Props {
    id?: string
    label?: string
    description?: string
    placeholder?: string
    required?: boolean
    value?: NamedDependentPost[]
    defaultValue?: NamedDependentPost[]
    onChange?: (value: NamedDependentPost[]) => void
    onFocus?: FocusEventHandler<HTMLDivElement>
    onBlur?: FocusEventHandler<HTMLDivElement>
    error?: any
    data: NamedItem[]
    relationHeading: string
}

function toInternal(value: NamedDependentPost[] | undefined): NamedRelationRowValue[] | undefined {
    if (value === undefined) return undefined
    return value.map(({name, value}) => ({
        name,
        relation: value ? value.id : null
    }))
}

function fromInternal(internalValue: NamedRelationRowValue[]): NamedDependentPost[] {
    return internalValue.map(({name, relation}) => ({
        name,
        value: relation ? {
            id: relation
        } : null,
    }))
}

export function NamedRelationsSelect(
    {
        id,
        label,
        description,
        placeholder,
        required,
        value,
        defaultValue,
        onChange,
        onFocus,
        onBlur,
        error,
        data,
        relationHeading,
    }: Props
) {
    const [internalValue, setInternalValue] = useState<NamedRelationRowValue[]>(
        toInternal(value) || toInternal(defaultValue) || []
    )

    const updateInternalValue = useCallback((value: NamedRelationRowValue[]) => {
        setInternalValue(value)
        onChange && onChange(fromInternal(value))
    }, [onChange])

    const onAdd = useCallback(() => {
        updateInternalValue([
            ...internalValue,
            {name: "New account", relation: null},
        ])
    }, [internalValue])

    const onDelete = useCallback((index: number) => {
        updateInternalValue([
            ...internalValue.slice(0, index),
            ...internalValue.slice(index + 1),
        ])
    }, [internalValue])

    const onRelationChange = useCallback((index: number, relation: NamedRelationRowValue) => {
        updateInternalValue([
            ...internalValue.slice(0, index),
            relation,
            ...internalValue.slice(index + 1),
        ])
    }, [internalValue])

    function NamedRelationsBody() {
        if (internalValue.length === 0) {
            return <Table.Tbody>
                <Table.Tr>
                    <Table.Td colSpan={3} align="center">
                        {placeholder}
                    </Table.Td>
                </Table.Tr>
            </Table.Tbody>
        }
        return <Table.Tbody>
            {internalValue.map((relation, index) => (
                <NamedRelationRow
                    key={`${id}-named-relation-${index}`}
                    id={`${id}-named-relation-${index}`}
                    value={relation}
                    data={data}
                    onChange={(relation) => onRelationChange(index, relation)}
                    onDelete={() => onDelete(index)}
                />
            ))}
        </Table.Tbody>
    }

    return <InputWrapper
        label={label}
        description={description}
        required={required}
        error={error}
        inputWrapperOrder={['label', 'description', 'error', 'input']}
        onFocus={onFocus}
        onBlur={onBlur}
    >
        <Space h={5}/>
        <Paper withBorder>
            <Table
                horizontalSpacing="md"
                verticalSpacing="xs"
                miw={700}
                stickyHeader
            >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>
                            Name
                        </Table.Th>
                        <Table.Th>
                            {relationHeading}
                        </Table.Th>
                        <Table.Th>
                            <Group justify="center">
                                <ActionIcon
                                    variant="transparent"
                                    size="sm"
                                    onClick={onAdd}
                                >
                                    <IconCirclePlus/>
                                </ActionIcon>
                            </Group>
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <NamedRelationsBody/>
            </Table>
        </Paper>
    </InputWrapper>
}
