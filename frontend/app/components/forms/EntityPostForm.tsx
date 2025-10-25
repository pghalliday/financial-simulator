import {ItemTextInput} from "~/components/controls/ItemTextInput";
import type {ItemPostFieldGetter, ItemPostFieldSetter} from "~/lib/hooks/useItemPost";
import type {EntityPost} from "~/lib/types";
import {ItemSelectInput} from "~/components/controls/ItemSelectInput";
import {ENTITY_TYPES} from "~/strings";
import {Title} from "@mantine/core";
import {useTypeIndicator} from "~/lib/hooks/useTypeIndicator";

export function EntityPostForm({
                                   allowSelectType,
                                   getField,
                                   setField,
                               }: {
    allowSelectType?: boolean,
    getField: ItemPostFieldGetter<EntityPost>,
    setField: ItemPostFieldSetter<EntityPost>,
}) {
    const typeIndicator = useTypeIndicator(ENTITY_TYPES, getField)
    const typeSelectData = Object.entries(ENTITY_TYPES).map(entry => ({
        value: entry[0],
        label: entry[1],
    }))
    const selectType = allowSelectType ? <ItemSelectInput<EntityPost, "type">
        field={"type"}
        getField={getField}
        setField={setField}
        label="Type"
        description={"Select the entity type"}
        placeholder={"Entity type"}
        data={typeSelectData}
        required
    /> : <Title order={4}>{typeIndicator}</Title>
    return <>
        {selectType}
        <ItemTextInput<EntityPost, "name">
            field="name"
            getField={getField}
            setField={setField}
            label="Name"
            description={"Entity name"}
            placeholder="Name"
            required
        />
        <ItemTextInput<EntityPost, "description">
            field="description"
            getField={getField}
            setField={setField}
            label="Description"
            description={"Entity description"}
            placeholder="Description"
        />
    </>
}
