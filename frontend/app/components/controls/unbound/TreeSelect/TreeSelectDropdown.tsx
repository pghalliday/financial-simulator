import {Combobox, Text} from "@mantine/core";
import type {TreeData} from "~/lib/TreeData";

interface Props<Node extends {}> {
    options: Node[]
    data: TreeData<Node>
    search: string
    allowCreate?: boolean
    createPrompt?: string
}

export function TreeSelectDropdown<Node extends {}>(
    {
        options,
        data,
        search,
        allowCreate = false,
        createPrompt = "Create new...",
    }: Props<Node>
) {
    const searchOptions = options.map((node) => (
        <Combobox.Option value={data.getId(node)} key={data.getId(node)}>
            <Text>{data.getLabel(node)}</Text>
        </Combobox.Option>
    ))

    const comboBoxOptions = search === "" || !allowCreate ? searchOptions : [...searchOptions, (
        <Combobox.Option value="" key="">
            <Text>{createPrompt}</Text>
        </Combobox.Option>
    )]

    return <Combobox.Dropdown>
        <Combobox.Options>
            {comboBoxOptions.length > 0 ? comboBoxOptions : <Combobox.Empty>Nothing found...</Combobox.Empty>}
        </Combobox.Options>
    </Combobox.Dropdown>
}