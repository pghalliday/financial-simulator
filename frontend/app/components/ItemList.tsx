import {ActionIcon, Anchor, Center, Group, Table, Text, TextInput, UnstyledButton} from "@mantine/core";
import {IconChevronDown, IconChevronUp, IconCirclePlus, IconSearch, IconSelector, IconTrash} from "@tabler/icons-react";
import {createSearchParams, Link} from "react-router"
import classes from './css/TableSort.module.css';
import {type ReactElement, useEffect, useState} from "react";

const DEFAULT_REVERSED = false
const DEFAULT_SEARCH = ""

export interface RowData {
    id: string
    name: string
    description: string
    type?: string
}

const SEARCH_FIELDS: (keyof RowData)[] = ["name", "description"]

interface SortBy {
    field: keyof RowData,
    reversed: boolean,
}

const DEFAULT_SORT_BY: SortBy[] = [{
    field: "name",
    reversed: DEFAULT_REVERSED,
}, {
    field: "description",
    reversed: DEFAULT_REVERSED,
}, {
    field: "type",
    reversed: DEFAULT_REVERSED,
}]

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
        SEARCH_FIELDS.some((key) =>
            item[key]!.toLowerCase().includes(query)
        ));
}

function compareField(a: RowData, b: RowData, sortBy: SortBy): number {
    if (sortBy.reversed) {
        return b[sortBy.field]!.localeCompare(a[sortBy.field]!);
    }
    return a[sortBy.field]!.localeCompare(b[sortBy.field]!);
}

function compare(a: RowData, b: RowData, sortBy: SortBy[]): number {
    let result = 0
    for (const s of sortBy) {
        result = compareField(a, b, s)
        if (result !== 0) {
            return result
        }
    }
    return result
}

function sortData(
    data: RowData[],
    payload: { sortBy: SortBy[]; search: string }
) {
    const {sortBy} = payload;

    if (!sortBy) {
        return filterData(data, payload.search);
    }

    return filterData(
        [...data].sort((a, b) => compare(a, b, sortBy)),
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
    const [sortBy, setSortBy] = useState<SortBy[]>(DEFAULT_SORT_BY);
    const [sortedData, setSortedData] = useState<RowData[]>([]);
    const [rows, setRows] = useState<ReactElement[]>([])

    useEffect(() => {
        setSortedData(sortData(data, {sortBy, search}));
    }, [data, sortBy, search]);

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
        if (field === sortBy[0].field) {
            setSortBy([{
                field,
                reversed: !sortBy[0].reversed,
            }, ...sortBy.slice(1)]);
        } else {
            setSortBy([{
                field,
                reversed: DEFAULT_REVERSED,
            }, ...sortBy.filter(s => s.field !== field)])
        }
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
            sorted={sortBy[0].field === 'type'}
            reversed={sortBy[0].reversed}
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
                        sorted={sortBy[0].field === 'name'}
                        reversed={sortBy[0].reversed}
                        onSort={() => setSorting('name')}
                    >
                        Name
                    </Th>
                    <TypeH/>
                    <Th
                        sorted={sortBy[0].field === 'description'}
                        reversed={sortBy[0].reversed}
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