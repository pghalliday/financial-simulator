import {type ReactElement, useEffect, useState} from 'react';
import {Combobox, Group, Pill, PillsInput, useCombobox} from '@mantine/core';
import {type LedgerAccountGet} from "~/client";
import {useGetSetWithType} from "~/components/providers/GetSetProvider";

export interface LedgerAccountSelectorProps<Type extends {}, Key extends keyof Type> {
    field: Key
    ledgerAccounts: LedgerAccountGet[],
    label: string
    description: string
    placeholder: string
    required?: boolean
}

export function LedgerAccountSelector<Type extends {}, Key extends keyof Type>({
                                                                                   field,
                                                                                   ledgerAccounts,
                                                                                   label,
                                                                                   description,
                                                                                   placeholder,
                                                                                   required,
                                                                               }: LedgerAccountSelectorProps<Type, Key>) {
    const {getField, setField} = useGetSetWithType<Type, string>()
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const [options, setOptions] = useState<ReactElement[]>([])
    const [search, setSearch] = useState('');
    const [value, setValue] = useState<string>();
    const [values, setValues] = useState<ReactElement[]>([]);

    useEffect(() => {
        setValue(getField(field))
    }, [getField]);

    useEffect(() => {
        setField(field, value)
    }, [value]);

    function locate(ledgerAccounts: LedgerAccountGet[], ledgerAccountId: string | undefined): LedgerAccountGet[] {
        if (ledgerAccountId !== undefined) {
            for (const ledgerAccount of ledgerAccounts) {
                if (ledgerAccount.id === ledgerAccountId) {
                    return [ledgerAccount]
                }
                const result = locate(ledgerAccount.sub_accounts, ledgerAccountId)
                if (result.length > 0) {
                    return [ledgerAccount, ...result]
                }
            }
        }
        return []
    }

    function getParent(ledgerAccountId: string): LedgerAccountGet | undefined {
        const path = locate(ledgerAccounts, ledgerAccountId)
        if (path.length > 1) return path[path.length - 2]
        return undefined
    }

    const handleValueRemove = () =>
        setValue((current) => getParent(current!)?.id)

    useEffect(() => {
        setValues(locate(ledgerAccounts, value).map((ledgerAccount) => (
            <Pill key={ledgerAccount.id}>
                {ledgerAccount.account_name}
            </Pill>
        )));
    }, [ledgerAccounts, value]);

    useEffect(() => {
        const path = locate(ledgerAccounts, value)
        const subAccounts = path.length === 0 ? ledgerAccounts : path[path.length - 1].sub_accounts
        setOptions(subAccounts
            .filter(subAccount => subAccount.account_name.includes(search))
            .map(subAccount => (
                <Combobox.Option value={subAccount.id} key={subAccount.id}>
                    <Group gap="sm">
                        <span>{subAccount.account_name}</span>
                    </Group>
                </Combobox.Option>
            )))
    }, [value, search, ledgerAccounts]);

    return (
        <Combobox store={combobox} onOptionSubmit={setValue}>
            <Combobox.DropdownTarget>
                <PillsInput
                    label={label}
                    description={description}
                    required={required}
                    onClick={() => combobox.openDropdown()}
                >
                    <Pill.Group>
                        {values}

                        <Combobox.EventsTarget>
                            <PillsInput.Field
                                onFocus={() => combobox.openDropdown()}
                                onBlur={() => combobox.closeDropdown()}
                                value={search}
                                placeholder={placeholder}
                                onChange={(event) => {
                                    combobox.updateSelectedOptionIndex();
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
                    {options.length > 0 ? options : <Combobox.Empty>Nothing found...</Combobox.Empty>}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}