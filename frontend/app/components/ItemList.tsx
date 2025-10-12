import {ActionIcon, Anchor, Group, Table} from "@mantine/core";
import {IconCirclePlus, IconTrash} from "@tabler/icons-react";

interface Item {
    id: string
    name: string
    description: string
    type?: string
}

export function ItemList({items, types, href}: {
    items: Item[],
    types?: Record<string, string>,
    href: (id: string) => string
}) {
    function TypeH() {
        if (types === undefined) {
            return null
        }
        return <Table.Th>Type</Table.Th>
    }

    function TypeD({item}: { item: Item }) {
        if (types === undefined) {
            return null
        }
        return <Table.Td>{types[item.type!]}</Table.Td>
    }

    const rows = items.map(item => (
        <Table.Tr key={item.id}>
            <Table.Td>
                <Anchor href={href(item.id)}>{item.name}</Anchor>
            </Table.Td>
            <TypeD item={item}/>
            <Table.Td>{item.description}</Table.Td>
            <Table.Td>
                <Group justify="center">
                    <ActionIcon variant="transparent" size="sm">
                        <IconTrash/>
                    </ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));
    return <Table.ScrollContainer minWidth={600}>
        <Table striped highlightOnHover withTableBorder withColumnBorders stickyHeader>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <TypeH/>
                    <Table.Th>Description</Table.Th>
                    <Table.Th>
                        <Group justify="center">
                            <ActionIcon variant="transparent" size="sm">
                                <IconCirclePlus/>
                            </ActionIcon>
                        </Group>
                    </Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    </Table.ScrollContainer>
}