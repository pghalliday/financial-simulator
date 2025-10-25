import {ActionIcon, Anchor, Box, Center, Group, Table, Text, TextInput, UnstyledButton} from "@mantine/core";
import {IconChevronDown, IconChevronUp, IconCirclePlus, IconSearch, IconSelector, IconTrash} from "@tabler/icons-react";
import {Link} from "react-router"
import classes from './ItemList.module.css';
import {type ReactElement, type ReactNode, useEffect, useLayoutEffect, useRef, useState} from "react";

import {getFieldOfType, type IdItem, type KeysOfType} from "~/lib/types";
import type {ItemPageParams} from "~/lib/hooks/useItemPageParams";

const VISIBLE_HEIGHT_OFFSET = 30

const DEFAULT_REVERSED = false
const DEFAULT_SEARCH = ""

export type SearchKeys<Type> = KeysOfType<Type, string>
type ColumnTypes = string | number | boolean
type ColumnKeys<Type> = KeysOfType<Type, ColumnTypes>

interface _Column<Type, Key extends ColumnKeys<Type>> {
    field: Key,
    heading: string,
    hasLink: boolean,
    compare: (a: Type[Key], b: Type[Key]) => number,
    render?: (value: Type[Key]) => string,
}

export type Column<Type> = _Column<Type, ColumnKeys<Type>>

export interface SortBy<Type> {
    column: Column<Type>
    reversed: boolean,
}

interface ThProps {
    children: ReactNode;
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

function filterData<Type>(data: Type[], search: string, searchFields: SearchKeys<Type>[]) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
        searchFields.some((key) =>
            getFieldOfType(item, key).toLowerCase().includes(query)
        ));
}

function compareField<Type>(a: Type, b: Type, sortBy: SortBy<Type>): number {
    const column = sortBy.column
    const compare = column.compare
    const field = column.field
    if (sortBy.reversed) {
        return compare(b[field], a[field])
    }
    return compare(a[field], b[field])
}

function compare<Type>(a: Type, b: Type, sortBy: SortBy<Type>[]): number {
    let result = 0
    for (const s of sortBy) {
        result = compareField(a, b, s)
        if (result !== 0) {
            return result
        }
    }
    return result
}

function sortData<Type>(
    data: Type[],
    sortBy: SortBy<Type>[],
    search: string,
    searchFields: SearchKeys<Type>[],
) {
    return filterData(
        [...data].sort((a, b) => compare(a, b, sortBy)),
        search,
        searchFields,
    );
}

export interface ItemListProps<Type extends IdItem> {
    columns: Column<Type>[],
    items: Type[],
    getItemPageParams: (item: Type) => ItemPageParams,
    href: (item: ItemPageParams) => string,
    onAdd: () => void,
    onDelete: (item: Type) => void,
    searchFields: SearchKeys<Type>[]
    defaultSortBy: SortBy<Type>[]
}

export function ItemList<Type extends IdItem>({
                                                  columns,
                                                  items,
                                                  getItemPageParams,
                                                  href,
                                                  onAdd,
                                                  onDelete,
                                                  searchFields,
                                                  defaultSortBy,
                                              }: ItemListProps<Type>) {
    const [search, setSearch] = useState(DEFAULT_SEARCH);
    const [sortBy, setSortBy] = useState<SortBy<Type>[]>(defaultSortBy);
    const [sortedData, setSortedData] = useState<Type[]>([]);
    const [rows, setRows] = useState<ReactElement[]>([])
    const ref = useRef<HTMLDivElement>(null);
    const [tableMaxHeight, setTableMaxHeight] = useState<number>(0);

    useLayoutEffect(() => {
        function measure() {
            const {innerHeight} = window;
            const {top} = ref.current!.getBoundingClientRect();
            setTableMaxHeight(innerHeight - top - VISIBLE_HEIGHT_OFFSET)
        }

        measure()
        window.addEventListener("resize", measure);
        return () => {
            window.removeEventListener("resize", measure);
        };
    }, [ref]);

    useEffect(() => {
        setSortedData(sortData(items, sortBy, search, searchFields));
    }, [items, sortBy, search]);

    useEffect(() => {
        setRows(sortedData.map((item) => {
            const cells = columns.map(column => {
                const value = getFieldOfType(item, column.field)
                const rendered = column.render !== undefined ? column.render(value) : value
                const content = column.hasLink ? (
                    <Anchor component={Link} to={href(getItemPageParams(item))}>
                        {rendered}
                    </Anchor>
                ) : rendered
                return <Table.Td key={column.heading}>
                    {content}
                </Table.Td>
            })
            return <Table.Tr key={item.id}>
                {cells}
                <Table.Td>
                    <Group justify="center">
                        <ActionIcon
                            variant="transparent"
                            size="sm"
                            onClick={() => onDelete(item)}
                        >
                            <IconTrash/>
                        </ActionIcon>
                    </Group>
                </Table.Td>
            </Table.Tr>
        }));
    }, [sortedData]);

    const setSorting = (column: Column<Type>) => {
        if (column.field === sortBy[0].column.field) {
            setSortBy([{
                column,
                reversed: !sortBy[0].reversed,
            }, ...sortBy.slice(1)]);
        } else {
            setSortBy([{
                column,
                reversed: DEFAULT_REVERSED,
            }, ...sortBy.filter(s => s.column.field !== column.field)])
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = event.currentTarget;
        setSearch(value);
    };

    const headings = columns.map(column => (
        <Th
            key={column.heading}
            sorted={sortBy[0].column.field === column.field}
            reversed={sortBy[0].reversed}
            onSort={() => setSorting(column)}
        >
            {column.heading}
        </Th>
    ))

    return <Box>
        <TextInput
            placeholder="Search by name or description"
            mb="md"
            leftSection={<IconSearch size={16} stroke={1.5}/>}
            value={search}
            onChange={handleSearchChange}
        />
        <Box ref={ref}>
            <Table.ScrollContainer minWidth={600} maxHeight={tableMaxHeight}>
                <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} stickyHeader>
                    <Table.Thead>
                        <Table.Tr>
                            {headings}
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
                    <Table.Tbody>
                        {rows.length > 0 ? (
                            rows
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={columns.length + 1}>
                                    <Text fw={500} ta="center">
                                        Nothing found
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </Box>
    </Box>
}