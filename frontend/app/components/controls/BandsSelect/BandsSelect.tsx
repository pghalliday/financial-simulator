import {type FocusEventHandler, useCallback, useState} from "react";
import {ActionIcon, Group, InputWrapper, NumberInput, Paper, Select, Space, Table, Text} from "@mantine/core";
import {IconCirclePlus, IconTrash} from "@tabler/icons-react";

export interface Band {
    value: string | null
    size: number
}

export interface Bands {
    bands: Band[]
    remainder_value: string | null
}

export interface Data {
    value: string
    label: string
}

export interface Props {
    label?: string
    description?: string
    required?: boolean
    value?: Bands
    defaultValue?: Bands
    onChange?: (value: Bands) => void
    onFocus?: FocusEventHandler<HTMLDivElement>
    onBlur?: FocusEventHandler<HTMLDivElement>
    error?: any
    data: Data[]
}

interface InternalBand {
    value: string | null
    from: number
    to: number
}

interface InternalBands {
    bands: InternalBand[]
    remainder_value: string | null
    remainder_from: number
}

function toInternal(bands: Bands | undefined): InternalBands | undefined {
    if (bands === undefined) return undefined
    let from = 0
    return {
        bands: bands.bands.map(band => {
            const to = from + band.size
            const internalBand = {
                value: band.value,
                from: from,
                to: to,
            }
            from = to
            return internalBand
        }),
        remainder_value: bands.remainder_value,
        remainder_from: from,
    }
}

function fromInternal(bands: InternalBands): Bands {
    return {
        bands: bands.bands.map(band => ({
            value: band.value,
            size: band.to - band.from,
        })),
        remainder_value: bands.remainder_value,
    }
}

export function BandsSelect(
    {
        label,
        description,
        required,
        value,
        defaultValue,
        onChange,
        onFocus,
        onBlur,
        error,
        data,
    }: Props
) {
    const [internalValue, setInternalValue] = useState<InternalBands>(
        toInternal(value) || toInternal(defaultValue) || {
            bands: [],
            remainder_value: null,
            remainder_from: 0,
        }
    )

    const updateInternalValue = useCallback((value: InternalBands) => {
        setInternalValue(value)
        onChange && onChange(fromInternal(value))
    }, [onChange])

    const onAdd = useCallback(() => {
        const bandCount = internalValue.bands.length
        const from = bandCount > 0 ? internalValue.bands[bandCount - 1].to : 0
        updateInternalValue({
            ...internalValue,
            bands: [
                ...internalValue.bands,
                {
                    value: null,
                    from: from,
                    to: from,
                },
            ]
        })
    }, [internalValue])

    const onDelete = useCallback((index: number) => {
        const bandCount = internalValue.bands.length
        const deleted = internalValue.bands[index]
        if (index === bandCount - 1) {
            updateInternalValue({
                ...internalValue,
                bands: [
                    ...internalValue.bands.slice(0, index),
                    ...internalValue.bands.slice(index + 1),
                ],
                remainder_from: deleted.from,
            })
        } else {
            const next = internalValue.bands[index + 1]
            updateInternalValue({
                ...internalValue,
                bands: [
                    ...internalValue.bands.slice(0, index),
                    {
                        ...next,
                        from: deleted.from,
                    },
                    ...internalValue.bands.slice(index + 2),
                ]
            })
        }
    }, [internalValue])

    const onRemainderValueChange = useCallback((value: string | null) => {
        updateInternalValue({
            ...internalValue,
            remainder_value: value,
        })
    }, [internalValue])

    const onBandValueChange = useCallback((index: number, value: string | null) => {
        updateInternalValue({
            ...internalValue,
            bands: [
                ...internalValue.bands.slice(0, index),
                {
                    ...internalValue.bands[index],
                    value: value,
                },
                ...internalValue.bands.slice(index + 1),
            ]
        })
    }, [internalValue])

    const onBandToChange = useCallback((index: number, value: string | number) => {
        const numberValue = typeof value === "string" ? parseFloat(value) : value
        const bandCount = internalValue.bands.length
        const changed = internalValue.bands[index]
        if (index === bandCount - 1) {
            updateInternalValue({
                ...internalValue,
                bands: [
                    ...internalValue.bands.slice(0, index),
                    {
                        ...changed,
                        to: numberValue,
                    },
                    ...internalValue.bands.slice(index + 1),
                ],
                remainder_from: numberValue,
            })
        } else {
            const next = internalValue.bands[index + 1]
            updateInternalValue({
                ...internalValue,
                bands: [
                    ...internalValue.bands.slice(0, index),
                    {
                        ...changed,
                        to: numberValue,
                    },
                    {
                        ...next,
                        from: numberValue,
                    },
                    ...internalValue.bands.slice(index + 2),
                ]
            })
        }
    }, [internalValue])

    function AddCell() {
        return <Table.Td>
            <Group justify="center">
                <ActionIcon
                    variant="transparent"
                    size="sm"
                    onClick={onAdd}
                >
                    <IconCirclePlus/>
                </ActionIcon>
            </Group>
        </Table.Td>
    }

    function DeleteCell({index}: { index: number }) {
        return <Table.Td>
            <Group justify="center">
                <ActionIcon
                    variant="transparent"
                    size="sm"
                    onClick={() => onDelete(index)}
                >
                    <IconTrash/>
                </ActionIcon>
            </Group>
        </Table.Td>
    }

    function AlwaysRow() {
        return <Table.Tr>
            <Table.Td colSpan={5} ta="center">
                <Text fw={500}>
                    Always
                </Text>
            </Table.Td>
            <Table.Td>
                <Select
                    value={internalValue.remainder_value}
                    data={data}
                    onChange={onRemainderValueChange}
                />
            </Table.Td>
            <AddCell/>
        </Table.Tr>
    }

    function RemainderRow() {
        const lastIndex = internalValue.bands.length - 1
        const lastBand = internalValue.bands[lastIndex]
        return <Table.Tr>
            <Table.Td>
                <Text fw={500}>
                    Above
                </Text>
            </Table.Td>
            <Table.Td>
                <NumberInput
                    allowNegative={false}
                    min={lastBand.from}
                    value={internalValue.remainder_from}
                    onChange={(value) => onBandToChange(lastIndex, value)}
                />
            </Table.Td>
            <Table.Td colSpan={2}>
                <Space/>
            </Table.Td>
            <Table.Td>
                <Select
                    value={internalValue.remainder_value}
                    data={data}
                    onChange={onRemainderValueChange}
                />
            </Table.Td>
            <AddCell/>
        </Table.Tr>
    }

    function SingleBandRow() {
        const band = internalValue.bands[0]
        return <Table.Tr>
            <Table.Td colSpan={2}>
                <Space/>
            </Table.Td>
            <Table.Td>
                <Text fw={500}>
                    Below
                </Text>
            </Table.Td>
            <Table.Td>
                <NumberInput
                    allowNegative={false}
                    min={band.from}
                    value={band.to}
                    onChange={(value) => onBandToChange(0, value)}
                />
            </Table.Td>
            <Table.Td>
                <Select
                    value={band.value}
                    data={data}
                    onChange={(value) => onBandValueChange(0, value)}
                />
            </Table.Td>
            <DeleteCell index={0}/>
        </Table.Tr>
    }

    function FirstBandRow() {
        const band = internalValue.bands[0]
        const nextBand = internalValue.bands[1]
        return <Table.Tr>
            <Table.Td colSpan={2}>
                <Space/>
            </Table.Td>
            <Table.Td>
                <Text fw={500}>
                    Below
                </Text>
            </Table.Td>
            <Table.Td>
                <NumberInput
                    allowNegative={false}
                    value={band.to}
                    min={band.from}
                    max={nextBand.to}
                    onChange={(value) => onBandToChange(0, value)}
                />
            </Table.Td>
            <Table.Td>
                <Select
                    value={band.value}
                    data={data}
                    onChange={(value) => onBandValueChange(0, value)}
                />
            </Table.Td>
            <DeleteCell index={0}/>
        </Table.Tr>
    }

    function BandRow({index}: { index: number }) {
        const previousBand = internalValue.bands[index - 1]
        const band = internalValue.bands[index]
        const nextBand = internalValue.bands[index + 1]
        return <Table.Tr>
            <Table.Td>
                <Text fw={500}>
                    From
                </Text>
            </Table.Td>
            <Table.Td>
                <NumberInput
                    min={previousBand.from}
                    max={band.to}
                    value={band.from}
                    onChange={(value) => onBandToChange(index - 1, value)}
                />
            </Table.Td>
            <Table.Td>
                <Text fw={500}>
                    To
                </Text>
            </Table.Td>
            <Table.Td>
                <NumberInput
                    min={band.from}
                    max={nextBand.to}
                    value={band.to}
                    onChange={(value) => onBandToChange(index, value)}
                />
            </Table.Td>
            <Table.Td>
                <Select
                    value={band.value}
                    data={data}
                    onChange={(value) => onBandValueChange(index, value)}
                />
            </Table.Td>
            <DeleteCell index={index}/>
        </Table.Tr>
    }

    function LastBandRow({index}: { index: number }) {
        const previousBand = internalValue.bands[index - 1]
        const band = internalValue.bands[index]
        return <Table.Tr>
            <Table.Td>
                <Text fw={500}>
                    From
                </Text>
            </Table.Td>
            <Table.Td>
                <NumberInput
                    min={previousBand.from}
                    max={band.to}
                    value={band.from}
                    onChange={(value) => onBandToChange(index - 1, value)}
                />
            </Table.Td>
            <Table.Td>
                <Text fw={500}>
                    To
                </Text>
            </Table.Td>
            <Table.Td>
                <NumberInput
                    min={band.from}
                    value={band.to}
                    onChange={(value) => onBandToChange(index, value)}
                />
            </Table.Td>
            <Table.Td>
                <Select
                    value={band.value}
                    data={data}
                    onChange={(value) => onBandValueChange(index, value)}
                />
            </Table.Td>
            <DeleteCell index={index}/>
        </Table.Tr>
    }

    function BandRows() {
        if (internalValue.bands.length === 0) {
            return <AlwaysRow key="remainder"/>
        } else if (internalValue.bands.length === 1) {
            return <>
                <SingleBandRow key={`band-${0}`}/>
                <RemainderRow key="remainder"/>
            </>
        } else {
            return <>
                {internalValue.bands.map((band, index) => {
                    if (index === 0) {
                        return <FirstBandRow key={`band-${0}`}/>
                    } else if (index === internalValue.bands.length - 1) {
                        return <LastBandRow index={index} key={`band-${index}`}/>
                    } else {
                        return <BandRow index={index} key={`band-${index}`}/>
                    }
                })}
                <RemainderRow key="remainder"/>
            </>
        }
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
                withRowBorders={false}
            >
                <BandRows/>
            </Table>
        </Paper>
    </InputWrapper>
}
