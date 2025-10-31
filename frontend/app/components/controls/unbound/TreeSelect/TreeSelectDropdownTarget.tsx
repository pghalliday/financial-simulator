import {Combobox, Pill, PillsInput} from "@mantine/core";
import type {TreeData} from "~/lib/TreeData";
import type {FocusEventHandler, ReactNode} from "react";

interface Props<Node extends {}> {
    path: Node[],
    data: TreeData<Node>
    label?: string
    description?: string
    required?: boolean
    openDropdown?: () => void
    closeDropdown?: () => void
    onFocus?: FocusEventHandler<HTMLDivElement>
    onBlur?: FocusEventHandler<HTMLDivElement>
    error?: ReactNode
    placeholder?: string
    search: string
    onSearchChange: (search: string) => void
    onValueRemove: () => void
}

export function TreeSelectDropdownTarget<Node extends {}>(
    {
        path,
        data,
        label,
        description,
        required,
        openDropdown,
        closeDropdown,
        onFocus,
        onBlur,
        error,
        placeholder,
        search,
        onSearchChange,
        onValueRemove,
    }: Props<Node>
) {
    const pills = path.map((node) => (
        <Pill key={data.getId(node)}>
            {data.getLabel(node)}
        </Pill>
    ))
    return <Combobox.DropdownTarget>
        <PillsInput
            label={label}
            description={description}
            required={required}
            onClick={openDropdown}
            onFocus={onFocus}
            onBlur={onBlur}
            error={error}
        >
            <Pill.Group>
                {pills}

                <Combobox.EventsTarget>
                    <PillsInput.Field
                        onFocus={openDropdown}
                        onBlur={closeDropdown}
                        value={search}
                        placeholder={placeholder}
                        onChange={(event) => {
                            onSearchChange(event.currentTarget.value);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Backspace' && search.length === 0 && path.length > 0) {
                                event.preventDefault();
                                onValueRemove();
                            }
                        }}
                    />
                </Combobox.EventsTarget>
            </Pill.Group>
        </PillsInput>
    </Combobox.DropdownTarget>
}