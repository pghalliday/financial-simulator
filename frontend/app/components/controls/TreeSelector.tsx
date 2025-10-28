import {useCallback, useEffect, useState} from 'react';
import {Combobox, Pill, PillsInput, Text, useCombobox} from '@mantine/core';
import {useGetSetWithType} from "~/components/providers/GetSetProvider";

export interface TreeNode {
    id: string,
    label: string,
    children: string[],
    parent: string,
    path: string[],
}

export type TreeData = Record<string, TreeNode>

export const EMPTY_TREE_DATA: TreeData = {
    "": {id: "", label: "", children: [], parent: "", path: []}
}

export interface TreeSelectorProps<Type extends {}, Key extends keyof Type> {
    field: Key
    onCreate?: (search: string, parent_id?: string) => void,
    createPrompt?: string,
    data: TreeData,
    label: string
    description: string
    placeholder: string
    required?: boolean
}

export function TreeSelector<Type extends {}, Key extends keyof Type>({
                                                                          field,
                                                                          onCreate,
                                                                          createPrompt,
                                                                          data,
                                                                          label,
                                                                          description,
                                                                          placeholder,
                                                                          required,
                                                                      }: TreeSelectorProps<Type, Key>) {
    const {getField, setField} = useGetSetWithType<Type, string>()
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.selectFirstOption(),
    });

    const [options, setOptions] = useState<TreeNode[]>([])
    const [search, setSearch] = useState('');
    const [value, setValue] = useState('');
    const [lastSelected, setLastSelected] = useState<TreeNode>();
    const [values, setValues] = useState<TreeNode[]>([]);

    useEffect(() => {
        setValue(getField(field) || '')
    }, [getField]);

    useEffect(() => {
        setField(field, value || undefined)
    }, [value]);

    const handleValueRemove = useCallback(() => {
        const node = data[value]
        setValue(node.parent)
    }, [data, value])

    const handleOptionSelect = useCallback((optionValue: string) => {
        if (optionValue === "") {
            onCreate && onCreate(search, value || undefined)
        } else {
            setValue(optionValue)
            setSearch('')
        }
    }, [onCreate, search, value])

    useEffect(() => {
        setValues(data[value].path.map(id => data[id]))
    }, [data, value]);

    useEffect(() => {
        setLastSelected(options[combobox.selectedOptionIndex])
        setOptions(data[value].children
            .map(key => data[key])
            .filter(node => node.label.includes(search)))
    }, [value, search, data, onCreate]);

    useEffect(() => {
        const option = options.find(option => option.id === lastSelected?.id)
        if (option === undefined) {
            combobox.selectFirstOption()
        } else {
            combobox.updateSelectedOptionIndex()
        }
    }, [options]);

    const pills = values.map(({id, label}) => (
        <Pill key={id}>
            {label}
        </Pill>
    ))

    const searchOptions = options.map(({id, label}) => (
        <Combobox.Option value={id} key={id}>
            <Text>{label}</Text>
        </Combobox.Option>
    ))

    const comboBoxOptions = search === "" || onCreate === undefined ? searchOptions : [...searchOptions, (
        <Combobox.Option value="" key="">
            <Text>{createPrompt || "Create new..."}</Text>
        </Combobox.Option>
    )]


    return (
        <Combobox store={combobox} onOptionSubmit={handleOptionSelect}>
            <Combobox.DropdownTarget>
                <PillsInput
                    label={label}
                    description={description}
                    required={required}
                    onClick={() => combobox.openDropdown()}
                >
                    <Pill.Group>
                        {pills}

                        <Combobox.EventsTarget>
                            <PillsInput.Field
                                onFocus={() => combobox.openDropdown()}
                                onBlur={() => combobox.closeDropdown()}
                                value={search}
                                placeholder={placeholder}
                                onChange={(event) => {
                                    setSearch(event.currentTarget.value);
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Backspace' && search.length === 0 && values.length > 0) {
                                        event.preventDefault();
                                        handleValueRemove();
                                    }
                                }}
                            />
                        </Combobox.EventsTarget>
                    </Pill.Group>
                </PillsInput>
            </Combobox.DropdownTarget>

            <Combobox.Dropdown>
                <Combobox.Options>
                    {comboBoxOptions.length > 0 ? comboBoxOptions : <Combobox.Empty>Nothing found...</Combobox.Empty>}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}