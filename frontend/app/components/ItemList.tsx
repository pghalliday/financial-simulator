import {ActionIcon, Anchor, Center, Group, keys, Table, Text, TextInput, UnstyledButton} from "@mantine/core";
import {IconChevronDown, IconChevronUp, IconCirclePlus, IconSearch, IconSelector, IconTrash} from "@tabler/icons-react";
import {createSearchParams, Link} from "react-router"
import classes from './css/TableSort.module.css';
import {type ReactElement, useEffect, useState} from "react";

const DEFAULT_SORT_BY = "name"
const DEFAULT_REVERSED = false
const DEFAULT_SEARCH = ""

export interface RowData {
    id: string
    name: string
    description: string
    type?: string
}

export interface ToDeleteData {
    id: string
    name: string
}

interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort: () => void;
}

function Th({children, reversed, sorted, onSort}: ThProps) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <Table.Th className={classes.th}>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Group justify="space-between">
                    <Text fw={500} fz="sm">
                        {children}
                    </Text>
                    <Center className={classes.icon}>
                        <Icon size={16} stroke={1.5}/>
                    </Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    );
}

function filterData(data: RowData[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
        keys(data[0]).some((key) => {
            return ["name", "description"]
                .includes(key) ? item[key]!.toLowerCase().includes(query) : false
        })
    );
}

function sortData(
    data: RowData[],
    payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
    const {sortBy} = payload;

    if (!sortBy) {
        return filterData(data, payload.search);
    }

    return filterData(
        [...data].sort((a, b) => {
            if (payload.reversed) {
                return b[sortBy]!.localeCompare(a[sortBy]!);
            }

            return a[sortBy]!.localeCompare(b[sortBy]!);
        }),
        payload.search
    );
}

export function ItemList({data, itemTypes, href, onAdd, onDelete}: {
    data: RowData[],
    itemTypes?: Record<string, string>,
    href: (id: string) => string,
    onAdd: () => void,
    onDelete: (toDeleteData: ToDeleteData) => void,
}) {
    const [search, setSearch] = useState(DEFAULT_SEARCH);
    const [sortBy, setSortBy] = useState<keyof RowData>(DEFAULT_SORT_BY);
    const [reversed, setReversed] = useState(DEFAULT_REVERSED);
    const [sortedData, setSortedData] = useState<RowData[]>([]);
    const [rows, setRows] = useState<ReactElement[]>([])

    useEffect(() => {
        setSortedData(sortData(data, {sortBy, reversed, search}));
    }, [data, sortBy, reversed, search]);

    useEffect(() => {
        setRows(sortedData.map((row) => (
            <Table.Tr key={row.id}>
                <Table.Td>
                    <Anchor component={Link} to={`${href(row.id)}?${createSearchParams({name: row.name})}`}>
                        {row.name}
                    </Anchor>
                </Table.Td>
                <TypeD row={row}/>
                <Table.Td>{row.description}</Table.Td>
                <Table.Td>
                    <Group justify="center">
                        <ActionIcon
                            variant="transparent"
                            size="sm"
                            onClick={() => onDelete({
                                id: row.id,
                                name: row.name
                            })}
                        >
                            <IconTrash/>
                        </ActionIcon>
                    </Group>
                </Table.Td>
            </Table.Tr>
        )));
    }, [sortedData]);

    const setSorting = (field: keyof RowData) => {
        const newReversed = field === sortBy ? !reversed : false;
        setReversed(newReversed);
        setSortBy(field);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = event.currentTarget;
        setSearch(value);
    };

    function TypeH() {
        if (itemTypes === undefined) {
            return null
        }
        return <Th
            sorted={sortBy === 'type'}
            reversed={reversed}
            onSort={() => setSorting('type')}
        >
            Type
        </Th>
    }

    function TypeD({row}: { row: RowData }) {
        if (itemTypes === undefined) {
            return null
        }
        return <Table.Td>{itemTypes[row.type!]}</Table.Td>
    }

    return <Table.ScrollContainer minWidth={600}>
        <TextInput
            placeholder="Search by name or description"
            mb="md"
            leftSection={<IconSearch size={16} stroke={1.5}/>}
            value={search}
            onChange={handleSearchChange}
        />
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} stickyHeader>
            <Table.Tbody>
                <Table.Tr>
                    <Th
                        sorted={sortBy === 'name'}
                        reversed={reversed}
                        onSort={() => setSorting('name')}
                    >
                        Name
                    </Th>
                    <TypeH/>
                    <Th
                        sorted={sortBy === 'description'}
                        reversed={reversed}
                        onSort={() => setSorting('description')}
                    >
                        Description
                    </Th>
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
            </Table.Tbody>
            <Table.Tbody>
                {rows.length > 0 ? (
                    rows
                ) : (
                    <Table.Tr>
                        <Table.Td colSpan={itemTypes ? 4 : 3}>
                            <Text fw={500} ta="center">
                                Nothing found
                            </Text>
                        </Table.Td>
                    </Table.Tr>
                )}
            </Table.Tbody>
        </Table>
    </Table.ScrollContainer>
}