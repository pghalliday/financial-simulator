import {type FocusEventHandler, useCallback, useEffect, useState} from 'react';
import {Combobox, useCombobox} from '@mantine/core';
import type {TreeData} from "~/lib/TreeData";
import {TreeSelectDropdownTarget} from "~/components/controls/TreeSelect/TreeSelectDropdownTarget";
import {TreeSelectDropdown} from "~/components/controls/TreeSelect/TreeSelectDropdown";

export interface Props<Node extends {}> {
    onCreate?: (search: string, parent: Node[]) => void,
    createPrompt?: string,
    data: TreeData<Node>,
    label?: string
    description?: string
    placeholder?: string
    required?: boolean
    value?: string | null
    defaultValue?: string | null
    onChange?: (value: string | null) => void
    onFocus?: FocusEventHandler<HTMLDivElement>
    onBlur?: FocusEventHandler<HTMLDivElement>
    error?: any
}

function getOptions<Node extends {}>(path: Node[], data: TreeData<Node>, search: string) {
    return data.getChildrenFromPath(path).filter(node => data.getLabel(node).includes(search))
}

const DEFAULT_SEARCH = ""

export function TreeSelect<Node extends {}>(
    {
        onCreate,
        createPrompt,
        data,
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
    }: Props<Node>
) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.selectFirstOption(),
    });

    const [internalValue, setInternalValue] = useState(value || defaultValue || null)
    const [search, setSearch] = useState(DEFAULT_SEARCH);
    const [path, setPath] = useState(data.getPath(internalValue));
    const [options, setOptions] = useState(getOptions(path, data, search))
    const [lastSelected, setLastSelected] = useState<Node>();

    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value)
        }
    }, [value]);

    useEffect(() => {
        const path = data.getPath(internalValue)
        setPath(path)
        setLastSelected(options[combobox.getSelectedOptionIndex()])
        setOptions(getOptions(path, data, search))
    }, [data, internalValue, search]);

    useEffect(() => {
        setSearch(DEFAULT_SEARCH)
    }, [internalValue]);

    const updateInternalValue = useCallback((value: string | null) => {
        setInternalValue(value)
        onChange && onChange(value)
    }, [onChange])

    const removeValue = useCallback(() => {
        updateInternalValue(data.getParentIdFromPath(path))
    }, [path, data, updateInternalValue])

    const addValue = useCallback((value: string) => {
        if (value === "") {
            onCreate && onCreate(search, path)
        } else {
            updateInternalValue(value)
        }
    }, [onCreate, path, search, updateInternalValue])

    useEffect(() => {
        const option = options.find(
            node => data.getId(node) === (lastSelected ? data.getId(lastSelected) : undefined)
        )
        if (option === undefined) {
            combobox.selectFirstOption()
        } else {
            combobox.updateSelectedOptionIndex()
        }
    }, [options]);

    return (
        <Combobox store={combobox} onOptionSubmit={addValue}>
            <TreeSelectDropdownTarget
                path={path}
                data={data}
                label={label}
                description={description}
                required={required}
                openDropdown={() => combobox.openDropdown()}
                closeDropdown={() => combobox.closeDropdown()}
                onFocus={onFocus}
                onBlur={onBlur}
                error={error}
                search={search}
                placeholder={placeholder}
                onSearchChange={setSearch}
                onValueRemove={removeValue}
            />
            <TreeSelectDropdown
                options={options}
                data={data}
                search={search}
                allowCreate={onCreate !== undefined}
                createPrompt={createPrompt}
            />
        </Combobox>
    );
}